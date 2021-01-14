import pymongo
import json
import textdistance as td
from bson import ObjectId
from bson.json_util import dumps
import bcrypt
import jwt
from pymongo import MongoClient
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from functools import wraps
import datetime
import base64
import io
import os
import sys
import pprint
from dotenv import load_dotenv
# load environment variables
load_dotenv()

# Create instance of Flask App
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('APP_SECRET_KEY')
ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
REFRESH_TOKEN_SECRET = os.getenv('REFRESH_TOKEN_SECRET')
ACCESS_TOKEN_DURATION = 30  # minutes
REFRESH_TOKEN_DURATION = 30  # days
CORS(app)

# Connects to Mongo Database
connection_url = os.getenv("MONGO_DB_CONNECTION")
client = pymongo.MongoClient(connection_url)

# authenticate user token


def tokenRequired(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json()

        try:
            if 'access_token' not in data:
                return jsonify({'success': False, 'msg': 'Access token is missing'}), 403

            access_token = data['access_token']
            decoded_token = jwt.decode(
                access_token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
        except:
            # generate new access token and return to client if refresh token is valid
            try:
                if 'refresh_token' not in data:
                    return jsonify({'success': False, 'msg': 'Refresh token is missing'}), 403

                refresh_token = data['refresh_token']
                decoded_token = jwt.decode(
                    refresh_token, REFRESH_TOKEN_SECRET, algorithms=["HS256"])
                access_token = generateAccessToken(data['user'])
                return jsonify({'success': False, 'msg': 'Access token expired', 'access_token': access_token})
            except:
                return jsonify({'success': False, 'msg': 'Refresh token is invalid'}), 403
            return jsonify({'success': False, 'msg': 'Access token is invalid'}), 403

        return f(*args, **kwargs)
    return decorated


def generateAccessToken(user):
    return jwt.encode({'user': user['firstName'] + user['lastName'],
                       'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_DURATION)},
                      ACCESS_TOKEN_SECRET,
                      algorithm="HS256")


def generateRefreshToken(user):
    return jwt.encode({'user': user['firstName'] + user['lastName'],
                       'exp': datetime.datetime.utcnow() + datetime.timedelta(days=REFRESH_TOKEN_DURATION)},
                      REFRESH_TOKEN_SECRET,
                      algorithm="HS256")

# refresh access token


@app.route('/refresh', methods=['POST'])
def refresh():
    data = request.get_json()
    user = data['user']
    try:
        if 'refresh_token' not in data:
            return jsonify({'success': False, 'message': 'Refresh token is missing'}), 403

        refresh_token = data['refresh_token']
        decoded_token = jwt.decode(
            refresh_token, REFRESH_TOKEN_SECRET, algorithms=["HS256"])
    except:
        return jsonify({'success': False, 'message': 'Refresh token is invalid'}), 403

    access_token = generateAccessToken(user)
    return jsonify({'success': True, 'access_token': access_token})

# check if a password is set on user account


@app.route('/checkPassword', methods=['POST'])
def checkPassword():
    db = client['marketplace']
    users = db['users']
    _id = request.get_json()['_id']
    user = users.find_one({'_id': ObjectId(_id)})
    if not user:
        return json.dumps({'success': False, 'msg': 'Account not found'})

    if 'hashedPassword' in user:
        return json.dumps({
            'success': True,
            'is_set': True
        })
    else:
        return json.dumps({
            'success': True,
            'is_set': False
        })

# Delete user from database


@app.route('/deleteUser', methods=['POST'])
def delete_user():
    db = client['marketplace']
    users = db['users']
    del_user = request.get_json()
    my_query = {"email": del_user['email']}
    user = users.find(my_query)
    for x in user:
        users.delete_one(x)
    return "success"

# Adds new user to database


@app.route('/register', methods=['POST'])
def add_user():
    db = client['marketplace']
    users = db['users']
    new_user = request.get_json()
    new_user['watchlist'] = []
    new_user['listings'] = []

    # check if email already registered
    user = users.find_one({'email': new_user['email']})
    if user:
        return json.dumps({"success": False, "msg": "An account exists for this email"})

    # register new account
    users.insert_one(new_user)
    user = users.find_one({'email': new_user['email']})
    access_token = generateAccessToken(new_user)
    refresh_token = generateRefreshToken(new_user)
    return json.dumps({"success": True,
                       "msg": "Account successfully created",
                       'user': getUser(user),
                       'watchlist': user['watchlist'],
                       'access_token': access_token,
                       'refresh_token': refresh_token
                       })


# Checks login credentials


@app.route('/login', methods=['POST'])
def login():
    db = client['marketplace']
    users = db['users']
    attempt = request.get_json()
    user = users.find_one({'email': attempt['email']})
    if user and 'hashedPassword' in user:
        # compare passwords
        if bcrypt.checkpw(attempt['password'].encode('utf-8'), user["hashedPassword"].encode('utf-8')):
            # generate tokens
            access_token = generateAccessToken(user)
            refresh_token = generateRefreshToken(user)
            return json.dumps({"success": True,
                               "msg": "Login successful",
                               'user': getUser(user),
                               'watchlist': user['watchlist'],
                               'access_token': access_token,
                               'refresh_token': refresh_token
                               })
        else:
            return json.dumps({"success": False, "msg": "Incorrect password"})
    # email does not exist
    return json.dumps({"success": False, "msg": "No account exists for this email"})

# login / register using Facebook or Google


@app.route('/oauth', methods=['POST'])
def oAuth():
    db = client['marketplace']
    users = db['users']
    userData = request.get_json()
    # check if account already registered
    if 'googleId' in userData:
        user = users.find_one({'googleId': userData['googleId']})
    elif 'facebookId' in userData:
        user = users.find_one({'facebookId': userData['facebookId']})
    message = 'Successfully authenticated'

    # account not connected
    if not user:
        # if email is registered, merge accounts with existing account
        user = users.find_one({'email': userData['email']})
        if user:
            userData.update(user)
            user = userData
            users.update_one(
                {'_id':  user['_id']},
                {
                    '$set': user,
                }
            )
            if 'googleId' in userData:
                platform = 'Google'
            elif 'facebookId' in userData:
                platform = 'Facebook'
            message = f'Connected {platform} to account'
        # create new account
        else:
            userData['watchlist'] = []
            userData['listings'] = []
            _id = users.insert_one(userData).inserted_id
            user = users.find_one({'_id': ObjectId(_id)})
            message = 'Account successfully created'

    access_token = generateAccessToken(userData)
    refresh_token = generateRefreshToken(userData)
    return json.dumps({"success": True,
                       "msg": message,
                       'user': getUser(user),
                       'watchlist': user['watchlist'],
                       'access_token': access_token,
                       'refresh_token': refresh_token
                       })

# Edit User details


@app.route('/editUser', methods=['POST'])
@tokenRequired
def edit_user():
    db = client['marketplace']
    users = db['users']
    data = request.get_json()
    user_id = data['_id']
    updated_user = data['user']
    updated_user['_id'] = ObjectId(user_id)

    # convert empty strings to None
    for key in updated_user:
        if updated_user[key] == "":
            updated_user[key] = None

    # check if email was changed
    user = users.find_one({'_id': updated_user['_id']})
    if 'email' in updated_user and user['email'] != updated_user['email']:
        # check if new email is already registered
        user = users.find_one({'email': updated_user['email']})
        if user:
            return json.dumps({"success": False, 'msg': 'An account exists for this email'})

    users.update_one(
        {'_id':  updated_user['_id']},
        {
            '$set': updated_user,
        }
    )

    user = users.find_one({'_id': updated_user['_id']})

    return json.dumps({"success": True, 'msg': "Account updated", 'user': getUser(user)})

# Get user info


@app.route('/getAccount', methods=['POST'])
def getAccount():
    db = client['marketplace']
    users = db['users']
    userData = request.get_json()
    user = users.find_one({'_id': ObjectId(userData['_id'])})
    if user:
        return json.dumps({
            'success': True,
            'msg': 'Account found',
            'user': getUserFull(user)
        })
    return json.dumps({'success': False, 'msg': 'Account not found'})

# turn basic user info into an object


def getUser(user):
    return {
        '_id': str(user['_id']),
        'firstName': user['firstName'],
        'lastName': user['lastName'],
        'imageUrl': None if 'imageUrl' not in user else user['imageUrl'],
        'profilePic': None if 'profilePic' not in user else user['profilePic'],
        'email': user['email'],
    }

# turn full user info into an object


def getUserFull(user):
    return {
        '_id': str(user['_id']),
        'googleId': None if 'googleId' not in user else user['googleId'],
        'facebookId': None if 'facebookId' not in user else user['facebookId'],
        'firstName': user['firstName'],
        'lastName': user['lastName'],
        'imageUrl': None if 'imageUrl' not in user else user['imageUrl'],
        'profilePic': None if 'profilePic' not in user else user['profilePic'],
        'email': user['email'],
        'phone': None if 'phone' not in user else user['phone'],
        'location': None if 'location' not in user else user['location'],
        'facebook': None if 'facebook' not in user else user['facebook'],
        'instagram': None if 'instagram' not in user else user['instagram'],
        'snapchat': None if 'snapchat' not in user else user['snapchat']
    }

# get list of watchlist item ids


@app.route('/getWatchlist', methods=['POST'])
@tokenRequired
def getWatchlist():
    db = client['marketplace']
    users = db['users']
    user_id = request.get_json()['_id']
    user = users.find_one({'_id': ObjectId(user_id)})
    if user:
        return json.dumps({
            'success': True,
            'msg': 'Account found',
            'watchlist': user['watchlist']
        })
    return json.dumps({'success': False, 'msg': 'Account not found'})

# get list of watchlist item objects


@app.route('/getWatchlistData', methods=['POST'])
@tokenRequired
def getWatchlistData():
    db = client['marketplace']
    items = db['items']
    users = db['users']
    user_id = request.get_json()['_id']
    user = users.find_one({'_id': ObjectId(user_id)})
    if user:
        watchlist = []
        # get item object for each id in watchlist
        for item_id in user['watchlist']:
            item = items.find_one({'_id': ObjectId(item_id)})
            if item:
                item['_id'] = str(item['_id'])
                watchlist.append(item)
            # item listing was removed, remove from user watchlist
            else:
                users.update_one(
                    {'_id':  ObjectId(user_id)},
                    {
                        '$pull': {'watchlist': item_id},
                    }
                )

        return json.dumps({
            'success': True,
            'msg': 'Account found',
            'watchlist': watchlist
        })
    return json.dumps({'success': False, 'msg': 'Account not found'})

# add item to watchlist


@app.route('/addWatchlist', methods=['POST'])
@tokenRequired
def addWatchlistItem():
    db = client['marketplace']
    users = db['users']
    data = request.get_json()
    item_id = data['item_id']
    user_id = data['user_id']
    try:
        users.update_one(
            {'_id':  ObjectId(user_id)},
            {
                '$addToSet': {'watchlist': item_id},
            }
        )
        user = users.find_one({'_id': ObjectId(user_id)})
        return json.dumps({"success": True, 'msg': "Item added to watchlist", 'watchlist': user['watchlist']})
    except:
        print("Unexpected error:", sys.exc_info()[0])
        return json.dumps({"success": False, 'msg': "Could not add item to watchlist"})

# remove item from watchlist


@app.route('/removeWatchlist', methods=['POST'])
@tokenRequired
def removeWatchlistItem():
    db = client['marketplace']
    users = db['users']
    data = request.get_json()
    item_id = data['item_id']
    user_id = data['user_id']
    try:
        users.update_one(
            {'_id':  ObjectId(user_id)},
            {
                '$pull': {'watchlist': item_id},
            }
        )
        user = users.find_one({'_id': ObjectId(user_id)})
        return json.dumps({"success": True, 'msg': "Item removed from watchlist", 'watchlist': user['watchlist']})
    except:
        print("Unexpected error:", sys.exc_info()[0])
        return json.dumps({"success": False, 'msg': "Could not remove item from watchlist"})

# Clean up and standardize text


def textFormat(text):
    new_text = ""
    for a in text:
        if a.isalpha():
            new_text += a
        elif a.isspace():
            new_text += " "
    new_text.lower().strip()
    new_text = list(new_text.split(" "))
    return new_text


# Search items in database
@app.route('/search', methods=['GET'])
def search():
    db = client['marketplace']
    items = db['items']

    results = []

    query = request.args.get('q')

    items.create_index([('title', pymongo.TEXT)],
                       name='item', default_language='english')

    matches = items.find({
        '$text': {'$search': query}
    })

    for item in matches:
        item['_id'] = str(item['_id'])
        results.append(item)

    return dumps({'results': results})

# Gets item from ID


@app.route('/getItem', methods=['GET'])
def getItem():
    db = client['marketplace']
    items = db['items']
    id = request.args.get('id')
    item = items.find_one({'_id': ObjectId(id)})
    if item:
        item['_id'] = str(item['_id'])
        return dumps({'success': True, 'item': item})
    return dumps({'success': False, 'msg': 'Item not found'})

# Deletes Item from items database


@app.route('/deleteItem', methods=['POST'])
def delete_item():
    db = client['marketplace']
    items = db['items']
    del_item = request.get_json()
    my_query = {"_id": ObjectId(del_item['_id'])}
    item = items.find(my_query)
    for x in item:
        items.delete_one(x)
    return "success"

# Adds Item to items database


@app.route('/addItem', methods=['POST'])
def add_item():
    db = client['marketplace']
    items = db['items']
    new_item = request.get_json()
    new_entry = items.insert_one(new_item)
    return json.dumps({"success": True, "id": str(new_entry.inserted_id)})


# Edit Items in database
@app.route('/editItem', methods=['POST'])
def edit_item():
    db = client['marketplace']
    items = db['items']
    new_item = request.get_json()
    new_item['_id'] = ObjectId(new_item['_id'])
    my_query = {"_id": new_item['_id']}
    item = items.find(my_query)
    for x in item:
        items.delete_one(x)
    items.insert_one(new_item)
    return "success"


if __name__ == '__main__':
    app.run()
