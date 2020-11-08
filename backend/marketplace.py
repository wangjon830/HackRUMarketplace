#add
#delete
#prices, user, item name, image array
import pymongo
import json
from pymongo import MongoClient
from flask import Flask, request
from flask_cors import CORS

#Create instance of Flask App
app = Flask(__name__)
CORS(app)

#Connects to Mongo Database
connection_url = 'mongodb+srv://ruteam:ruscrew@cluster0.bvss2.mongodb.net/RUConnect?retryWrites=true&w=majority'
client = pymongo.MongoClient(connection_url)

#Search items in database
@app.route('/search', methods=['GET'])
def search():
    db = client['marketplace']
    items = db['items']
    search_info = request.get_json()
    return items

#Deletes Item from items database
@app.route('/deleteItem', methods=['POST'])
def delete_item():
    db = client['marketplace']
    items = db['items']
    del_item = request.get_json()
    my_query = {"name": del_item['name']}
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