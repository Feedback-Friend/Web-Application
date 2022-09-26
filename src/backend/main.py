from random import choices
from flask import Flask
from flask.json import jsonify
from sqlalchemy import create_engine
import sshtunnel

from user import *
from surveyCreation import *

# the build files for react go in the specified static folder, which allows flask to access react's frontend
app = Flask(__name__, static_folder='../../build/', static_url_path='/')

# connecting to oracle cloud compute unit for database
tunnel = sshtunnel.SSHTunnelForwarder(
    ('150.136.92.200', 22), 
    ssh_username='opc', 
    ssh_pkey="ssh-key-2022-09-13.key",
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
    cursor = engine.connect()
    return registerUser(cursor, firstName, lastName, userName, passWord, emailAddress)

@app.route('/loginUser/<userName>/<passWord>', methods=['GET'])
def loginUser(userName, passWord):
    cursor = engine.connect()
    return loginUser(cursor, userName, passWord)

@app.route('/getFirstName/<userID>/<firstName>', methods=['GET'])
def getFirstName(userID, firstName):
    cursor = engine.connect()
    return getFirstName(cursor, userID, firstName)

@app.route('/updateFirstName/<userID>/<firstName>', methods=['GET'])
def updateFirstName(userID, firstName):
    cursor = engine.connect()
    updateFirstName(cursor, userID, firstName)

@app.route('/getFirstName/<userID>/<firstName>', methods=['GET'])
def getLastName(userID, firstName):
    cursor = engine.connect()
    return getLastName(cursor, userID, firstName)

@app.route('/updateLastName/<userID>/<lastName>', methods=['GET'])
def updateLastName(userID, lastName):
    cursor = engine.connect()
    updateLastName(cursor, userID, lastName)

@app.route('/getFirstName/<userID>/<firstName>', methods=['GET'])
def getUserName(userID, firstName):
    cursor = engine.connect()
    return getUserName(cursor, userID, firstName)

@app.route('/updateUserName/<userID>/<userName>', methods=['GET'])
def updateUserName(userID, userName):
    cursor = engine.connect()
    updateUserName(cursor, userID, userName)

@app.route('/getFirstName/<userID>/<firstName>', methods=['GET'])
def getPassWord(userID, firstName):
    cursor = engine.connect()
    return getPassWord(cursor, userID, firstName)

@app.route('/updatePassWord/<userID>/<passWord>', methods=['GET'])
def updatePassWord(userID, passWord):
    cursor = engine.connect()
    updatePassWord(cursor, userID, passWord)

@app.route('/getFirstName/<userID>/<firstName>', methods=['GET'])
def getEmailAddress(userID, firstName):
    cursor = engine.connect()
    return getEmailAddress(cursor, userID, firstName)
    
@app.route('/updateEmailAddress/<userID>/<emailAddress>', methods=['GET'])
def updateEmailAddress(userID, emailAddress):
    cursor = engine.connect()
    updateEmailAddress(cursor, userID, emailAddress)

@app.route('/getSurveys/<userID>', methods=['GET'])
def getSurveys(userID):
    cursor = engine.connect()
    return getSurveys(cursor, userID)
      
@app.route('/addSurvey/<userID>/<surveyName>', methods=['POST'])
def addSurvey(userID, surveyName):
    cursor = engine.connect()
    return addSurvey(cursor, userID, surveyName)

@app.route('/deleteSurvey/<surveyID>', methods=['DELETE'])
def deleteSurvey(surveyID):
    cursor = engine.connect()
    deleteSurvey(cursor, surveyID)

@app.route('/getQuestions/<surveyID>', methods=['GET'])
def getQuestions(surveyID):
    cursor = engine.connect()
    return getQuestions(cursor, surveyID)

@app.route('/addQuestion/<surveyID>/<questionType>/<prompt>', methods=['POST'])
def addQuestion(surveyID, questionType, prompt):
    cursor = engine.connect()
    return addQuestion(cursor, surveyID, questionType, prompt)

@app.route('/addFRQ/<surveyID>', methods=['GET'])
def addFRQ(surveyID):
    cursor = engine.connect()
    return addFRQ(cursor, surveyID)

@app.route('/updateFRQ/<questionID>/<prompt>', methods=['GET'])
def updateFRQ(questionID, prompt):
    cursor = engine.connect()
    updateFRQ(cursor, questionID, prompt)

@app.route('/deleteFRQ/<questionID>', methods=['GET'])
def deleteFRQ(questionID):
    cursor = engine.connect()
    deleteFRQ(cursor, questionID)

@app.route('/addMCQ_S/<surveyID>', methods=['GET'])
def addMCQ_S(surveyID):
    cursor = engine.connect()
    return addMCQ_S(cursor, surveyID)

@app.route('/addMCQ_M/<surveyID>', methods=['GET'])
def addMCQ_M(surveyID):
    cursor = engine.connect()
    return addMCQ_M(cursor, surveyID)

@app.route('/updateMCQ/<questionID>/<prompt>', methods=['GET'])
def updateMCQ(questionID, prompt):
    cursor = engine.connect()
    cursor.execute("UPDATE questions SET prompt = '%s' WHERE question_id = %s", (int(questionID), prompt))

@app.route('/deleteMCQ/<questionID>', methods=['GET'])
def deleteMCQ(questionID):
    cursor = engine.connect()
    return deleteMCQ(cursor, questionID)

@app.route('/getChoices/<questionID>', methods=['GET'])
def getChoices(questionID):
    cursor = engine.connect()
    return getChoices(cursor, questionID)

@app.route('/addChoice/<questionID>/<prompt>', methods=['POST'])
def addChoice(questionID, prompt):
    cursor = engine.connect()
    return addChoice(cursor, questionID, prompt)

@app.route('/updateChoice/<choiceID>/<prompt>', methods=['GET'])
def updateChoice(choiceID, prompt):
    cursor = engine.connect()
    updateChoice(cursor, choiceID, prompt)

@app.route('/deleteChoice/<choiceID>', methods=['GET'])
def deleteChoice(choiceID):
    cursor = engine.connect()
    deleteChoice(cursor, choiceID)
