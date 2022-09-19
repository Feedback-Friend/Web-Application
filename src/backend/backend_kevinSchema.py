from flask import Flask
import mysql.connector as mysql

# the build files for react go in the specified static folder, which allows flask to access react's frontend
app = Flask(__name__, static_folder='../../build/', static_url_path='/')

@app.route('/')
@app.route('/register')
def root():
    return app.send_static_file('index.html')

userID=0

# need to have functionality to create the SQL schema
# need to have functionality to delete the entire SQL schema and reload it
# need to have functionality to perform CRUD on the SQL database

@app.route('/registerUser/<firstName>/<lastName>/<userName>/<passWord>/<emailAddress>', methods=['GET'])
def registerUser(firstName, lastName, userName, passWord, emailAddress):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    table = cursor.fetchall()
    for entry in table:
        if entry[3] == userName or entry[5] == emailAddress:
            return -1
    cursor.execute("INSERT INTO users VALUES("+str(userID)+", "+firstName+", "+lastName+", "+userName+", "+passWord+", "+emailAddress+")")
    userID = userID+1
    return userID - 1

@app.route('/loginUser/<userName>/<passWord>', methods=['GET'])
def loginUser(userName, passWord):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    table = cursor.fetchall()
    for entry in table:
        if entry[3] == userName and entry[4] == passWord:
            return entry[0]
    return -1
