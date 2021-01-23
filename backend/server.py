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
        # generate new access token and return to client if access token is invalid
        def genNewAccessToken(data):
            try:
                if 'refresh_token' not in data:
                    print("Refresh token is missing")
                    return jsonify({'success': False, 'msg': 'Refresh token is missing'}), 403

                refresh_token = data['refresh_token']
                decoded_token = jwt.decode(
                    refresh_token, REFRESH_TOKEN_SECRET, algorithms=["HS256"])
                access_token = generateAccessToken(data['user'])
                return jsonify({'success': False, 'msg': 'Access token expired', 'access_token': access_token})
            except:
                print("Refresh token is invalid")
                return jsonify({'success': False, 'msg': 'Refresh token is invalid'}), 403

        data = request.get_json()

        access_token = data['access_token']
        # access token missing (expired)
        if not access_token:
            return genNewAccessToken(data)

        try:
            decoded_token = jwt.decode(
                access_token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
        # access token invalid
        except:
            return genNewAccessToken(data)

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
@tokenRequired
def delete_user():
    db = client['marketplace']
    users = db['users']
    notifications = db['notifications']
    items = db['items']
    user_id = request.get_json()['_id']
    user = users.find_one({'_id': ObjectId(user_id)})

    for notification_id in user['notifications']:
        notifications.delete_one({'_id': ObjectId(notification_id)})
    for item_id in user['listings']:
        items.delete_one({'_id': ObjectId(item_id)})

    users.delete_one({'_id': ObjectId(user_id)})
    return "success"


def create_user(new_user):
    new_user['watchlist'] = {}
    new_user['listings'] = []
    new_user['notifications'] = []
    new_user['stats'] = {
        'joined': datetime.datetime.now().strftime("%m/%d/%Y"),
        'listings_sold': 0
    }
    return new_user

# Adds new user to database


@app.route('/register', methods=['POST'])
def add_user():
    db = client['marketplace']
    users = db['users']
    new_user = request.get_json()
    new_user = create_user(new_user)

    # check if email already registered
    user = users.find_one({'email': new_user['email']})
    if user:
        return json.dumps({"success": False, "msg": "An account exists for this email"})

    # register new account
    user_id = users.insert_one(new_user).inserted_id
    _id = users.find_one({'_id': ObjectId(_id)})
    access_token = generateAccessToken(new_user)
    refresh_token = generateRefreshToken(new_user)
    return json.dumps({"success": True,
                       "msg": "Account successfully created",
                       'user': getUser(user),
                       'watchlist': user['watchlist'],
                       'access_token': access_token,
                       'refresh_token': refresh_token
                       })

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
            userData = create_user(userData)
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
        'profilePic': None if 'profilePic' not in user else user['profilePic'],
        'email': user['email'],
        'bio': None if 'bio' not in user else user['bio'],
        'phone': None if 'phone' not in user else user['phone'],
        'location': None if 'location' not in user else user['location'],
        'facebook': None if 'facebook' not in user else user['facebook'],
        'instagram': None if 'instagram' not in user else user['instagram'],
        'snapchat': None if 'snapchat' not in user else user['snapchat'],
        'stats': user['stats']
    }

# add notification when user adds item to watchlist


def addNotification(user_id, poster_id, item_id):
    db = client['marketplace']
    users = db['users']
    notifications = db['notifications']
    time = datetime.datetime.now()
    notification_id = notifications.insert_one({
        'user_id': user_id,
        'poster_id': poster_id,
        'item_id': item_id,
        'read': False,
        'time': [time.strftime("%m/%d/%Y"), time.strftime("%H:%M")]
    }).inserted_id

    users.update_one(
        {'_id':  ObjectId(poster_id)},
        {
            '$addToSet': {'notifications': notification_id},
        }
    )
    return str(notification_id)

# remove notification


def removeNotification(notification_id):
    db = client['marketplace']
    users = db['users']
    notifications = db['notifications']
    notification = notifications.find_one({'_id': ObjectId(notification_id)})
    if notification:
        users.update_one(
            {'_id':  ObjectId(notification['poster_id'])},
            {
                '$pull': {'notifications': notification_id},
            }
        )

        notifications.delete_one({'_id': ObjectId(notification_id)})
        return True
    else:
        return False


@app.route('/removeNotification', methods=['POST'])
@tokenRequired
def removeNotificationRoute():
    db = client['marketplace']
    users = db['users']
    notifications = db['notifications']

    notification_id = request.get_json()['_id']
    if removeNotification(notification_id):
        return json.dumps({
            'success': True,
            'msg': 'Notification removed',
        })
    else:
        return json.dumps({'success': False, 'msg': 'Notification not found'})

# get user's list of notification objects


@app.route('/getNotifications', methods=['POST'])
@tokenRequired
def getNotifications():
    db = client['marketplace']
    users = db['users']
    items = db['items']
    notifications = db['notifications']

    notification_data = []
    user_id = request.get_json()['_id']
    user = users.find_one({'_id': ObjectId(user_id)})
    if user:
        for notification_id in user['notifications']:
            notification = notifications.find_one(
                {'_id': ObjectId(notification_id)})
            if notification:
                other_user = users.find_one(
                    {'_id': ObjectId(notification['user_id'])})
                item = items.find_one(
                    {'_id': ObjectId(notification['item_id'])})
                # remove notification if listing no longer exists
                if not item:
                    notifications.delete_one({'_id': ObjectId(notification_id)})
                    continue
                    
                notification = {
                    '_id': str(notification_id),
                    'user': other_user['firstName'] + " " + other_user['lastName'],
                    'user_id': notification['user_id'],
                    'item_name': item['title'],
                    'item_id': notification['item_id'],
                    'read': notification['read'],
                    'time': notification['time']
                }
                notification_data.append(notification)
        return json.dumps({
            'success': True,
            'msg': 'Account found',
            'notifications': notification_data
        })
    return json.dumps({'success': False, 'msg': 'Account not found'})

# mark a user's notifications as read


@app.route('/markRead', methods=['POST'])
@tokenRequired
def markRead():
    db = client['marketplace']
    users = db['users']
    notifications = db['notifications']

    user_id = request.get_json()['_id']
    user = users.find_one({'_id': ObjectId(user_id)})
    if user:
        for notification_id in user['notifications']:
            notifications.update_one(
                {'_id':  ObjectId(notification_id)},
                {
                    '$set': {'read': True},
                }
            )
        return json.dumps({
            'success': True,
            'msg': 'Notifications marked as read',
        })
    return json.dumps({'success': False, 'msg': 'Account not found'})

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
        watchlist = {}
        # get item object for each id in watchlist
        for item_id, notification_id in user['watchlist']:
            item = items.find_one({'_id': ObjectId(item_id)})
            if item:
                item['_id'] = str(item['_id'])
                watchlist[item_id] = item
            # item listing was removed, remove from user watchlist
            else:
                updated_watchlist = user['watchlist']
                updated_watchlist.pop(item_id, None)
                users.update_one(
                    {'_id':  ObjectId(user_id)},
                    {
                        '$set': {'watchlist': updated_watchlist},
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
    items = db['items']
    data = request.get_json()
    item_id = data['item_id']
    user_id = data['user_id']
    try:
        # send notification to poster
        item = items.find_one({'_id': ObjectId(item_id)})
        notification_id = addNotification(user_id, item['poster'], item_id)

        # add item to user's watchlist
        users.update_one(
            {'_id':  ObjectId(user_id)},
            {
                '$set': {
                    # tie notification to watchlist item so notification can be removed if item is removed from watchlist
                    'watchlist': {item_id: notification_id}
                }
            }
        )
        user = users.find_one({'_id': ObjectId(user_id)})

        # add user to item's list of users
        items.update_one(
            {'_id':  ObjectId(item_id)},
            {
                '$addToSet': {'user_list': user_id},
            }
        )

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
    items = db['items']
    data = request.get_json()
    item_id = data['item_id']
    user_id = data['user_id']
    # try:
    # remove poster's notification
    user = users.find_one({'_id': ObjectId(user_id)})
    removeNotification(user['watchlist'][item_id])

    # remove item from user's watchlist
    updated_watchlist = user['watchlist']
    updated_watchlist.pop(item_id, None)
    users.update_one(
        {'_id':  ObjectId(user_id)},
        {
            '$set': {'watchlist': updated_watchlist},
        }
    )
    user = users.find_one({'_id': ObjectId(user_id)})

    # remove user from item's list of users
    items.update_one(
        {'_id':  ObjectId(item_id)},
        {
            '$pull': {'user_list': user_id},
        }
    )
    return json.dumps({"success": True, 'msg': "Item removed from watchlist", 'watchlist': user['watchlist']})
    # except:
    #     print("Unexpected error:", sys.exc_info()[0])
    #     return json.dumps({"success": False, 'msg': "Could not remove item from watchlist"})

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

# get list of users interested in item


@app.route('/getUserList', methods=['POST'])
@tokenRequired
def getUserList():
    db = client['marketplace']
    items = db['items']
    users = db['users']
    item_id = request.get_json()['item_id']
    item = items.find_one({'_id': ObjectId(item_id)})
    if item:
        user_list = []
        # get item object for each id in watchlist
        for user_id in item['user_list']:
            user = users.find_one({'_id': ObjectId(user_id)})
            if user:
                user_list.append(
                    {
                        '_id': user_id,
                        'profilePic': user['profilePic'],
                        'name': user['firstName'] + " " + user['lastName']
                    })
            # item listing was removed, remove from user listings
            else:
                items.update_one(
                    {'_id':  ObjectId(item_id)},
                    {
                        '$pull': {'user_list': user_id},
                    }
                )

        return json.dumps({
            'success': True,
            'msg': 'Item found',
            'user_list': user_list
        })
    return json.dumps({'success': False, 'msg': 'Item not found'})


@app.route('/getListingData', methods=['POST'])
@tokenRequired
def getListingData():
    db = client['marketplace']
    items = db['items']
    users = db['users']
    user_id = request.get_json()['_id']
    user = users.find_one({'_id': ObjectId(user_id)})
    if user:
        listings = {}
        # get item object for each id in watchlist
        for item_id in user['listings']:
            item = items.find_one({'_id': ObjectId(item_id)})
            if item:
                item['_id'] = str(item['_id'])
                listings[item_id] = item
            # item listing was removed, remove from user listings
            else:
                users.update_one(
                    {'_id':  ObjectId(user_id)},
                    {
                        '$pull': {'listings': item_id},
                    }
                )

        return json.dumps({
            'success': True,
            'msg': 'Account found',
            'listings': listings
        })
    return json.dumps({'success': False, 'msg': 'Account not found'})

# Deletes Item from items database


@app.route('/deleteItem', methods=['POST'])
@tokenRequired
def delete_item():
    db = client['marketplace']
    users = db['users']
    items = db['items']
    data = request.get_json()
    item_id = data['item_id']
    user_id = data['user_id']
    items.delete_one({"_id": ObjectId(item_id)})

    # remove item id from user's listings
    try:
        users.update_one(
            {'_id':  ObjectId(user_id)},
            {
                '$pull': {'listings': item_id},
            }
        )
        return json.dumps({"success": True, 'msg': "Listing removed"})
    except:
        print("Unexpected error:", sys.exc_info()[0])
        return json.dumps({"success": False, 'msg': "Could not remove listing"})

# Adds Item to items database


@app.route('/addItem', methods=['POST'])
@tokenRequired
def add_item():
    db = client['marketplace']
    users = db['users']
    items = db['items']
    data = request.get_json()
    new_item = data['item']
    user_id = data['user_id']
    timestamp = datetime.datetime.now()
    new_item['date'] = timestamp.strftime("%m/%d/%Y")
    new_item['poster'] = user_id
    # list of users that have listing on their watchlist
    new_item['user_list'] = []
    new_item_id = items.insert_one(new_item).inserted_id
    # add new item id to user's listings
    try:
        users.update_one(
            {'_id':  ObjectId(user_id)},
            {
                '$addToSet': {'listings': str(new_item_id)},
            }
        )
        return json.dumps({"success": True, 'msg': "Item successfully posted"})
    except:
        print("Unexpected error:", sys.exc_info()[0])
        return json.dumps({"success": False, 'msg': "Could not post listing"})

# Edit Items in database


@app.route('/editItem', methods=['POST'])
@tokenRequired
def edit_item():
    db = client['marketplace']
    items = db['items']
    data = request.get_json()
    new_item = data['new_item']
    new_item['_id'] = ObjectId(new_item['_id'])
    try:
        items.update_one(
            {"_id": new_item['_id']},
            {
                "$set": new_item
            }
        )

        return json.dumps({"success": True, "msg": "Listing updated"})
    except:
        print("Unexpected error:", sys.exc_info()[0])
        return json.dumps({"success": False, "msg": "Could not update listing"})


if __name__ == '__main__':
    app.run()
