# add
# delete
# prices, user, item name, image array
import pymongo
import json
import textdistance as td
from bson import ObjectId
from bson.json_util import dumps
import bcrypt
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import os

# Create instance of Flask App
app = Flask(__name__)
CORS(app)

# Connects to Mongo Database
connection_url = 'mongodb+srv://ruteam:ruscrew@cluster0.bvss2.mongodb.net/marketplace?retryWrites=true&w=majority'
client = pymongo.MongoClient(connection_url)

# Clean up and standardize text
def text_format(text):
    new_text = ""
    for a in text:
        if a.isalpha() or a.isspace():
            new_text += a
    new_text.lower()
    new_text = list(new_text.split(" "))
    return new_text

# Gets item from ID
@app.route('/getItem', methods=['GET'])
def get_id():
    db = client['marketplace']
    items = db['items']
    id = request.args.get("id")
    item = items.find_one({"_id": ObjectId(id)})
    if item is not None:
        print("item found")
        return dumps(item)
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
    item = items.find_one({"_id": ObjectId(del_item["_id"])})
    if item is not None:
        items.delete_one(item)
        return "success"
    return "failure"

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
    updated_item = request.get_json()
    updated_item['_id'] = ObjectId(updated_item['_id'])
    items.update_one(
        { '_id':  updated_item['_id']},
        {
            '$set': updated_item,
        }
    )
    return "success"

# Delete user from database
@app.route('/deleteUser', methods=['POST'])
def delete_user():
    db = client['marketplace']
    users = db['users']
    del_user = request.get_json()
    user = users.find_one({"_id": ObjectId(del_user["_id"])})
    if user is not None:
        users.delete_one(user)
        return "success"
    return "failure"

# Adds new user to database
@app.route('/register', methods=['POST'])
def add_user():
    db = client['marketplace']
    users = db['users']
    new_user = request.get_json()
    exist = users.find({"email": new_user["email"]})
    if exist is not None:
        return json.dumps({"success": False, "msg": "An account exists for this email"})
    users.insert_one(new_user)
    return json.dumps({"success": True, 
                        "msg": "Account successfully created", 
                        'user': get_user(document)
                    })

# Edit User details
@app.route('/editUser', methods=['POST'])
def edit_user():
    db = client['marketplace']
    users = db['users']
    updated_user = request.get_json()
    updated_user['_id'] = ObjectId(updated_user['_id'])
    users.update_one(
        { '_id':  updated_user['_id']},
        {
            '$set': updated_user,
        }
    )
    return json.dumps({"success":True})

# Checks login credentials
@app.route('/login', methods=['POST'])
def login():
    db = client['marketplace']
    users = db['users']
    attempt = request.get_json()
    document = users.find_one({'email': attempt['email']})
    if document is not None:
        if bcrypt.checkpw(attempt['password'].encode('utf-8'), document["hashedPassword"].encode('utf-8')):
            return json.dumps({"success": True, 
                                "msg": "Login successful", 
                                'user':get_user(document)
                            })
        else:
            return json.dumps({"success": False, "msg": "Incorrect password"})
    return json.dumps({"success": False, "msg": "No account exists for this email"})

# Get user info
@app.route('/getAccount', methods=['GET'])
def get_account():
    db = client['marketplace']
    users = db['users']
    new_user = request.get_json()
    account = users.find_one({"_id": ObjectId(new_user["_id"])})
    if account is not None:
        return json.dumps({
            'success': True,
            'msg': 'Account found',
            'user': get_user(document)
        })
    return json.dumps({'success': False, 'msg': 'Account not found'})

# turn user info into an object
def get_user(user):
    return {
                '_id': str(user['_id']),
                'firstName': user['firstName'],
                'lastName': user['lastName'],
                'profilePic': None if 'profilePic' not in user else user['profilePic'],
                'email': user['email'],
                'phone': None if 'phone' not in user else user['phone'],
                'facebook': None if 'facebook' not in user else user['facebook'],
                'instagram': None if 'instagram' not in user else user['instagram'],
                'snapchat': None if 'snapchat' not in user else user['snapchat']
            }


if __name__ == '__main__':
    app.run()
