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
    if user['email'] != updated_user['email']:
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

    return json.dumps({"success": True})

# Checks login credentials


@app.route('/login', methods=['POST'])
def login():
    db = client['marketplace']
    users = db['users']
    attempt = request.get_json()
    user = users.find_one({'email': attempt['email']})
    if user:
        # compare passwords
        if bcrypt.checkpw(attempt['password'].encode('utf-8'), user["hashedPassword"].encode('utf-8')):
            # generate tokens
            access_token = generateAccessToken(attempt)
            refresh_token = generateRefreshToken(attempt)
            return json.dumps({"success": True,
                               "msg": "Login successful",
                               'user': getUser(user),
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

    # account not registered
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
            _id = users.insert_one(userData).inserted_id
            user = users.find_one({'_id': ObjectId(_id)})
            message = 'Account successfully created'

    access_token = generateAccessToken(userData)
    refresh_token = generateRefreshToken(userData)
    return json.dumps({"success": True,
                       "msg": message,
                       'user': getUser(user),
                       'access_token': access_token,
                       'refresh_token': refresh_token
                       })

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

# Clean up and standardize text


def textFormat(text):
    newtext = ""
    for a in text:
        if a.isalpha() == True or a.isspace() == True:
            newtext += a
    newtext.lower()
    newtext = list(newtext.split(" "))
    return newtext

# Gets item from ID


@app.route('/getItem', methods=['GET'])
def getID():
    db = client['marketplace']
    items = db['items']
    id = request.args.get('id')
    my_query = {"_id": ObjectId(id)}
    item = items.find(my_query)
    for x in item:
        print("item found")
        return dumps(x)
    return "item not found"


# Search items in database
@app.route('/search', methods=['GET'])
def search():
    db = client['marketplace']
    items = db['items']
    items.create_index([('tags', 1)])
    items.create_index([('title', 1)])
    items.create_index([('description', 1)])

    search_items = []

    search_term = request.args.get('searchTerm')
    search_t = textFormat(search_term)
    # match terms in tags, title and description
    for tags in search_t:
        search_tags = items.find({'tags': {'$elemMatch': {'$eq': tags}}})
        search_items.extend(list(search_tags))

    search_title = items.find({'title': {'$regex': ".*" + search_term + ".*"}})
    search_desc = items.find(
        {'description': {'$regex': ".*" + search_term + ".*"}})

    search_items.extend(list(search_title))
    search_items.extend(list(search_desc))
    # string similarity- leveshtein algorithm for scanning title and description
    for query in items.find():
        try:
            desc = query["description"]
            title = query["title"]

            title_t = textFormat(title)
            desc_t = textFormat(desc)

            flag = 0
            for input_1 in search_t:
                for input_2 in title_t:
                    if td.levenshtein.normalized_similarity(input_1, input_2) > .5:
                        search_items.append(query)
                        print(query)
                        flag = 1
                    if flag == 1:
                        break
                if flag == 1:
                    break
                for input_3 in desc_t:
                    if td.levenshtein.normalized_similarity(input_1, input_3) > .5:
                        search_items.append(query)
                        flag = 1
                        break
                    if flag == 1:
                        break
                if flag == 1:
                    break
        except:
            pass
    jsondata = dumps(search_items)
    jsonlist = json.loads(jsondata)
    # remove duplicate objects
    jsons = {repr(each): each for each in jsonlist}.values()

    return dumps(jsons)

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
