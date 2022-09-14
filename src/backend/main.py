from flask import Flask
from flask.json import jsonify
import mysql.connector as mysql
from sqlalchemy import create_engine
import sshtunnel

# the build files for react go in the specified static folder, which allows flask to access react's frontend
app = Flask(__name__, static_folder='../../build/', static_url_path='/')

# connecting to oracle cloud compute unit for database
tunnel = sshtunnel.SSHTunnelForwarder(
    ('150.136.92.200', 22), 
    ssh_username='opc', 
    ssh_pkey="~/ssh-key-2022-09-13.key",
    remote_bind_address=('localhost', 3306)
)

tunnel.start()

engine = create_engine('mysql+mysqldb://test:rY!&pa4PsDAq@127.0.0.1:%s/db' % tunnel.local_bind_port)

# 
# ROUTES BELOW
# 

# login/register page
@app.route('/')
@app.route('/register')
def root():
    return app.send_static_file('index.html')

# TESTING PAGE
@app.route('/test')
def test():
    return str(engine.table_names())

# TODO: CHANGE TO POST
# get call to register user to db
@app.route('/registerUser/<firstName>/<lastName>/<userName>/<passWord>/<emailAddress>', methods=['GET'])
def registerUser(firstName, lastName, userName, passWord, emailAddress):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    # cursor = engine.connect() # remote connection to oracle db in compute unit bennett-test1
    cursor.execute("SELECT * FROM users")
    table = cursor.fetchall()
    for entry in table:
        if entry[3] == userName or entry[5] == emailAddress:
            return "-1"
    userID = 3 # TODO: find some way to get user id from db maybe? variable here won't work since it's gone if the server shuts down
    cursor.execute("INSERT INTO users VALUES(%s, %s, %s, %s, %s, %s)", (int(userID), firstName, lastName, userName, passWord, emailAddress))
    userID = userID+1
    return str(userID - 1)

@app.route('/loginUser/<userName>/<passWord>', methods=['GET'])
def loginUser(userName, passWord):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    # cursor = engine.connect() # remote connection to oracle db in compute unit bennett-test1
    cursor.execute("SELECT * FROM users")
    table = cursor.fetchall()
    for entry in table:
        if entry[3] == userName and entry[4] == passWord:
            return jsonify({"result": entry[0], "name": entry[1]})
    return jsonify({"result": "-1"})
