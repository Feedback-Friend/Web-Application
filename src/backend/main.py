from random import choices
from flask import Flask
from flask.json import jsonify
from sqlalchemy import create_engine
import sshtunnel

import user as user
import survey as survey
import contact as contact

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
    return user.registerUser(cursor, firstName, lastName, userName, passWord, emailAddress)

@app.route('/loginUser/<userName>/<passWord>', methods=['GET'])
def loginUser(userName, passWord):
    cursor = engine.connect()
    return user.loginUser(cursor, userName, passWord)

@app.route('/getFirstName/<userID>/<firstName>', methods=['GET'])
def getFirstName(userID, firstName):
    cursor = engine.connect()
    return user.getFirstName(cursor, userID, firstName)

@app.route('/updateFirstName/<userID>/<firstName>', methods=['GET'])
def updateFirstName(userID, firstName):
    cursor = engine.connect()
    user.updateFirstName(cursor, userID, firstName)

@app.route('/getFirstName/<userID>/<firstName>', methods=['GET'])
def getLastName(userID, firstName):
    cursor = engine.connect()
    return user.getLastName(cursor, userID, firstName)

@app.route('/updateLastName/<userID>/<lastName>', methods=['GET'])
def updateLastName(userID, lastName):
    cursor = engine.connect()
    user.updateLastName(cursor, userID, lastName)

@app.route('/getFirstName/<userID>/<firstName>', methods=['GET'])
def getUserName(userID, firstName):
    cursor = engine.connect()
    return user.getUserName(cursor, userID, firstName)

@app.route('/updateUserName/<userID>/<userName>', methods=['GET'])
def updateUserName(userID, userName):
    cursor = engine.connect()
    user.updateUserName(cursor, userID, userName)

@app.route('/getFirstName/<userID>/<firstName>', methods=['GET'])
def getPassWord(userID, firstName):
    cursor = engine.connect()
    return user.getPassWord(cursor, userID, firstName)

@app.route('/updatePassWord/<userID>/<passWord>', methods=['GET'])
def updatePassWord(userID, passWord):
    cursor = engine.connect()
    user.updatePassWord(cursor, userID, passWord)

@app.route('/getFirstName/<userID>/<firstName>', methods=['GET'])
def getEmailAddress(userID, firstName):
    cursor = engine.connect()
    return user.getEmailAddress(cursor, userID, firstName)
    
@app.route('/updateEmailAddress/<userID>/<emailAddress>', methods=['GET'])
def updateEmailAddress(userID, emailAddress):
    cursor = engine.connect()
    user.updateEmailAddress(cursor, userID, emailAddress)

@app.route('/deleteUser/<userID>', methods=['DELETE'])
def deleteUser(userID):
    cursor = engine.connect()
    user.deleteSurvey(cursor, userID)

@app.route('/getSurveys/<userID>', methods=['GET'])
def getSurveys(userID):
    cursor = engine.connect()
    return survey.getSurveys(cursor, userID)
      
@app.route('/addSurvey/<userID>/<surveyName>', methods=['POST'])
def addSurvey(userID, surveyName):
    cursor = engine.connect()
    return survey.addSurvey(cursor, userID, surveyName)

@app.route('/updateSurveyName/<surveyID>/<surveyName>', methods=['GET'])
def updateSurveyName(surveyID, surveyName):
    cursor = engine.connect()
    survey.updateFRQ(cursor, surveyID, surveyName)

@app.route('/deleteSurvey/<surveyID>', methods=['DELETE'])
def deleteSurvey(surveyID):
    cursor = engine.connect()
    survey.deleteSurvey(cursor, surveyID)

@app.route('/getQuestions/<surveyID>', methods=['GET'])
def getQuestions(surveyID):
    cursor = engine.connect()
    return survey.getQuestions(cursor, surveyID)

@app.route('/addQuestion/<surveyID>/<questionType>/<prompt>', methods=['POST'])
def addQuestion(surveyID, questionType, prompt):
    cursor = engine.connect()
    return survey.addQuestion(cursor, surveyID, questionType, prompt)

@app.route('/addFRQ/<surveyID>', methods=['GET'])
def addFRQ(surveyID):
    cursor = engine.connect()
    return survey.addFRQ(cursor, surveyID)

@app.route('/updateFRQ/<questionID>/<prompt>', methods=['GET'])
def updateFRQ(questionID, prompt):
    cursor = engine.connect()
    survey.updateFRQ(cursor, questionID, prompt)

@app.route('/deleteFRQ/<questionID>', methods=['GET'])
def deleteFRQ(questionID):
    cursor = engine.connect()
    survey.deleteFRQ(cursor, questionID)

@app.route('/addMCQ_S/<surveyID>', methods=['GET'])
def addMCQ_S(surveyID):
    cursor = engine.connect()
    return survey.addMCQ_S(cursor, surveyID)

@app.route('/addMCQ_M/<surveyID>', methods=['GET'])
def addMCQ_M(surveyID):
    cursor = engine.connect()
    return survey.addMCQ_M(cursor, surveyID)

@app.route('/updateMCQ/<questionID>/<prompt>', methods=['GET'])
def updateMCQ(questionID, prompt):
    cursor = engine.connect()
    survey.updateMCQ(cursor, questionID, prompt)

@app.route('/deleteMCQ/<questionID>', methods=['GET'])
def deleteMCQ(questionID):
    cursor = engine.connect()
    return survey.deleteMCQ(cursor, questionID)

@app.route('/getChoices/<questionID>', methods=['GET'])
def getChoices(questionID):
    cursor = engine.connect()
    return survey.getChoices(cursor, questionID)

@app.route('/addChoice/<questionID>/<prompt>', methods=['POST'])
def addChoice(questionID, prompt):
    cursor = engine.connect()
    return survey.addChoice(cursor, questionID, prompt)

@app.route('/updateChoice/<choiceID>/<prompt>', methods=['GET'])
def updateChoice(choiceID, prompt):
    cursor = engine.connect()
    survey.updateChoice(cursor, choiceID, prompt)

@app.route('/deleteChoice/<choiceID>', methods=['GET'])
def deleteChoice(choiceID):
    cursor = engine.connect()
    survey.deleteChoice(cursor, choiceID)

@app.route('/getContactLists/<userID>', methods=['GET'])
def getContactLists(userID):
    cursor = engine.connect()
    getContactLists(cursor, userID)

@app.route('/addContactList/<userID>/<contactListName>', methods=['GET'])
def addContactList(userID, contactListName):
    cursor = engine.connect()
    addContactList(cursor, userID, contactListName)

@app.route('/updateContactLists/<contactListID>/<contactListName>', methods=['GET'])
def updateContactListName(contactListID, contactListName):
    cursor = engine.connect()
    updateContactListName(cursor, contactListID, contactListName)

@app.route('/deleteContactLists/<contactListID>', methods=['GET'])
def deleteContactList(contactListID):
    cursor = engine.connect()
    deleteContactList(cursor, contactListID)

@app.route('/getContacts/<contactListID>', methods=['GET'])
def getContacts(contactListID):
    cursor = engine.connect()
    return getContacts(cursor, contactListID)

@app.route('/addContact/<contactListID>/<firstName>/<lastName>/<emailAddress>', methods=['GET'])
def addContact(contactListID, firstName, lastName, emailAddress):
    cursor = engine.connect()
    return addContact(cursor, contactListID, firstName, lastName, emailAddress)

@app.route('/updateContactFirstName/<contactID>/<firstName>', methods=['GET'])
def updateContactFirstName(contactID, firstName):
    cursor = engine.connect()
    updateContactFirstName(cursor, contactID, firstName)

@app.route('/updateContactLastName/<userID>/<lastName>', methods=['GET'])
def updateContactLastName(contactID, lastName):
    cursor = engine.connect()
    updateContactLastName(cursor, contactID, lastName)

@app.route('/updateContactEmailAddress/<contactID>/<emailAddress>', methods=['GET'])
def updateContactEmailAddress(contactID, emailAddress):
    cursor = engine.connect()
    updateContactEmailAddress(cursor, contactID, emailAddress)

@app.route('/deleteContact/<contactID>', methods=['GET'])
def deleteContact(contactID):
    cursor = engine.connect()
    deleteContact(cursor, contactID)