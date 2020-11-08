#add
#delete
#prices, user, item name, image array
import pymongo
import json
from bson import ObjectId
from bson.json_util import dumps
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS

#Create instance of Flask App
app = Flask(__name__)
CORS(app)

#Connects to Mongo Database
connection_url = 'mongodb+srv://ruteam:ruscrew@cluster0.bvss2.mongodb.net/marketplace?retryWrites=true&w=majority'
client = pymongo.MongoClient(connection_url)

def removeduplicate(it):
    seen = []
    for x in it:
        if x not in seen:
            yield x
            seen.append(x)
    return seen

#Search items in database
@app.route('/search', methods=['GET'])
def search():
    db = client['marketplace']
    items = db['items']
    items.create_index([('tags',1)])
    items.create_index([('title',1)])
    items.create_index([('description',1)])
    search_info = request.get_json()

    search_term = search_info['search_term'].lower()
    
    search_tags = items.find({'tags': {'$elemMatch': { '$eq' : search_term } } })
    search_title = items.find({'title': {'$regex': ".*" + search_term + ".*"  } } )
    search_desc = items.find({'description': {'$regex': ".*" + search_term + ".*" } })
    search_items = []
    search_items.extend(list(search_tags)) 
    search_items.extend(list(search_title))
    search_items.extend(list(search_desc))
    jsondata = dumps(search_items)
    jsonlist = json.loads(jsondata)
    jsons = { repr(each): each for each in jsonlist }.values()

    return dumps(jsons)

#Deletes Item from items database
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

#Adds Item to items database
@app.route('/addItem', methods=['POST'])
def add_item():
    db = client['marketplace']
    items = db['items']
    new_item = request.get_json()
    items.insert_one(new_item)
    return "success"

#Adds new user to database
@app.route('/addUser', methods=['POST'])
def add_user():
    db = client['marketplace']
    users = db['users']
    new_user = request.get_json()
    for document in users.find({}, projection={"_id": False}):
        if document["netid"] == new_user['netid']:
            return json.dumps({"msg": "exists"})
    users.insert_one(new_user)
    return json.dumps({"msg": "created"})

#Checks login credentials
@app.route('/login', methods=['POST'])
def login():
    db = client['marketplace']
    users = db['users']
    attempt = request.get_json()
    for document in users.find({}, projection = {"_id" : False}):
        if document["netid"] == attempt['netid']:
            if document["password"] == attempt['password']:
                return json.dumps({"msg": "correct"} )
            else:
                return json.dumps({"msg": "incorrect information"})
    return json.dumps({"msg": "user not found"})

if __name__ == "__main__":
    app.run()