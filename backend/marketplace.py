# add
# delete
# prices, user, item name, image array
import pymongo
import json
import textdistance as td
from bson import ObjectId
from bson.json_util import dumps
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS

# Create instance of Flask App
app = Flask(__name__)
CORS(app)

# Connects to Mongo Database
connection_url = 'mongodb+srv://ruteam:ruscrew@cluster0.bvss2.mongodb.net/marketplace?retryWrites=true&w=majority'
client = pymongo.MongoClient(connection_url)

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
@app.route('/getID', methods=['GET'])
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
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes

# Edit Items in database
@app.route('/editItem', methods=['POST'])
def edit_item():
    db = client['marketplace']
    items = db['items']
    new_item = request.get_json()
    my_query = {"_id": ObjectId(new_item['_id'])}
    item = items.find(my_query)
    for x in item:
        items.delete_one(x)
    items.insert_one(new_item)
    return "success"

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
    for document in users.find({}, projection={"_id": False}):
        if document["email"] == new_user['email']:
            return json.dumps({"success": False, "msg": "An account exists for this email"})
    users.insert_one(new_user)
    return json.dumps({"success": True, "msg": "Account successfully created", "firstName": document["firstName"], "lastName": document["lastName"], "email": document["email"]})

# Edit User details
@app.route('/editUser', methods=['POST'])
def edit_user():
    db = client['marketplace']
    users = db['users']
    new_user = request.get_json()
    my_query = {"email": new_user['email']}
    user = users.find(my_query)
    password = ''
    for x in user:
        password = x['password']
        users.delete_one(x)
    new_user['password'] = password
    users.insert_one(new_user)
    return "success"

# Checks login credentials
@app.route('/login', methods=['POST'])
def login():
    db = client['marketplace']
    users = db['users']
    attempt = request.get_json()
    for document in users.find({}, projection={"_id": False}):
        if document["email"] == attempt['email']:
            if document["password"] == attempt['password']:
                return json.dumps({"success": True, "msg": "Login successful", "firstName": document["firstName"], "lastName": document["lastName"], "email": document["email"]})
            else:
                return json.dumps({"success": False, "msg": "Incorrect password"})
    return json.dumps({"success": False, "msg": "No account exists for this email"})

# Get user info
@app.route('/getAccount', methods=['GET'])
def getAccount():
    db = client['marketplace']
    users = db['users']
    new_user = request.get_json()
    for document in users.find({}, projection={"_id": False}):
        if document["email"] == new_user['email']:
            return json.dumps({
                "success": True,
                "msg": "Account found",
                "firstName": document["firstName"],
                "lastName": document["lastName"],
                "profilePic": document["profilePic"],
                "email": document["email"],
                "phone": document["phone"],
                "facebook": document["facebook"],
                "instagram": document["instagram"]
            })
    return json.dumps({"success": False, "msg": "Account not found"})


if __name__ == "__main__":
    app.run()
