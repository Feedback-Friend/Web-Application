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
    userID = len(table)==0? 0 : table[len(table)-1][0]
    cursor.execute("INSERT INTO users VALUES(%s, %s, %s, %s, %s, %s)", (int(userID), firstName, lastName, userName, passWord, emailAddress))
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

@app.route('/deleteSurvey/<surveyID>', methods=['GET'])
def deleteSurvey(surveyID):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM questions WHERE surveyID='%s'", (str(surveyID)))
    table = cursor.fetchall()
    for entry in table:
        if entry[1] == surveyID:
                cursor.execute("DELETE FROM choices WHERE questionID = %s",(entry[1]))
                cursor.execute("DELETE FROM responses WHERE questionID = %s",(entry[1]))
    cursor.execute("DELETE FROM questions WHERE surveyID = %s",(surveyID))
    cursor.execute("DELETE FROM surveys WHERE surveyID = %s",(surveyID))

@app.route('/addFRQ/<surveyID>', methods=['GET'])
def addFRQ(surveyID):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM questions")
    table = cursor.fetchall()
    questionID = len(table)==0? 0 : table[len(table)-1][0]
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), 0, ""))

@app.route('/updateFRQ/<questionID>/<prompt>', methods=['GET'])
def updateFRQ(questionID, prompt):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("UPDATE questions SET prompt = '%s' WHERE questionID = %s", (int(questionID), prompt))

@app.route('/deleteFRQ/<questionID>', methods=['GET'])
def deleteFRQ(questionID):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("DELETE FROM questions WHERE questionID = %s", (int(questionID)))

@app.route('/addMCQ_S/<surveyID>', methods=['GET'])
def addMCQ_S(surveyID):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM questions")
    table = cursor.fetchall()
    questionID = len(table)==0? 0 : table[len(table)-1][0]
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), 1, ""))

@app.route('/addMCQ_M/<surveyID>', methods=['GET'])
def addMCQ_M(surveyID):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM questions")
    table = cursor.fetchall()
    questionID = len(table)==0? 0 : table[len(table)-1][0]
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), 2, ""))

@app.route('/updateMCQ/<questionID>/<prompt>', methods=['GET'])
def updateMCQ(questionID, prompt):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("UPDATE questions SET prompt = '%s' WHERE questionID = %s", (int(questionID), prompt))

@app.route('/deleteMCQ/<questionID>', methods=['GET'])
def deleteMCQ(questionID):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("DELETE FROM questions WHERE questionID = %s", (int(questionID)))

@app.route('/addChoice/<questionID>', methods=['GET'])
def addChoice(questionID):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM choices")
    table = cursor.fetchall()
    choiceID = len(table)==0? 0 : table[len(table)-1][0]
    cursor.execute("INSERT INTO choices VALUES(%s, %s, %s)", (int(choiceID), int(questionID), ""))

@app.route('/updateChoice/<choiceID>/<prompt>', methods=['GET'])
def updateChoice(choiceID, prompt):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("UPDATE choices SET prompt = '%s' WHERE choiceID = %s", (int(choiceID), prompt))

@app.route('/deleteChoice/<choiceID>', methods=['GET'])
def deleteChoice(choiceID):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("DELETE FROM choices WHERE choiceID = %s", (int(choiceID)))

@app.route('/setResponse/<questionID>/<prompt>', methods=['GET'])
def setResponse(questionID, prompt):
    db = mysql.connect(user="root", password="password", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("SELECT * FROM choices")
    table = cursor.fetchall()
    choiceID = len(table)==0? 0 : table[len(table)-1][0]
    cursor.execute("INSERT INTO responses VALUES(%s, %s, %s)", (int(responseID), int(questionID), prompt))