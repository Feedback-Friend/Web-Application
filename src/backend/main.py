from random import choices
from flask import Flask
from flask.json import jsonify
from sqlalchemy import create_engine
import sshtunnel
import os

import src.backend.users as user
import src.backend.surveys as survey
import src.backend.contacts as contact
import src.backend.emails as email

# the build files for react go in the specified static folder, which allows flask to access react's frontend
app = Flask(__name__, static_folder='../../build/', static_url_path='/')

# directory defaults to /, need to change it to see pkey
# os.chdir('/var/www/html/WebApplication/')

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
    return jsonify(user.registerUser(cursor, firstName, lastName, userName, passWord, emailAddress))

@app.route('/loginUser/<userName>/<passWord>', methods=['GET'])
def loginUser(userName, passWord):
    cursor = engine.connect()
    return jsonify(user.loginUser(cursor, userName, passWord))

@app.route('/getFirstName/<userID>', methods=['GET'])
def getFirstName(userID):
    cursor = engine.connect()
    return jsonify(user.getFirstName(cursor, userID))

@app.route('/updateFirstName/<userID>/<firstName>', methods=['GET'])
def updateFirstName(userID, firstName):
    cursor = engine.connect()
    return jsonify(user.updateFirstName(cursor, userID, firstName))

@app.route('/getLastName/<userID>', methods=['GET'])
def getLastName(userID):
    cursor = engine.connect()
    return jsonify(user.getLastName(cursor, userID))

@app.route('/updateLastName/<userID>/<lastName>', methods=['GET'])
def updateLastName(userID, lastName):
    cursor = engine.connect()
    return jsonify(user.updateLastName(cursor, userID, lastName))

@app.route('/getUserName/<userID>', methods=['GET'])
def getUserName(userID):
    cursor = engine.connect()
    return jsonify(user.getUserName(cursor, userID))

@app.route('/updateUserName/<userID>/<userName>', methods=['GET'])
def updateUserName(userID, userName):
    cursor = engine.connect()
    return jsonify(user.updateUserName(cursor, userID, userName))

@app.route('/getPassword/<userID>', methods=['GET'])
def getPassWord(userID):
    cursor = engine.connect()
    return jsonify(user.getPassWord(cursor, userID))

@app.route('/updatePassWord/<userID>/<passWord>', methods=['GET'])
def updatePassWord(userID, passWord):
    cursor = engine.connect()
    return jsonify(user.updatePassWord(cursor, userID, passWord))

@app.route('/getEmailAddress/<userID>', methods=['GET'])
def getEmailAddress(userID):
    cursor = engine.connect()
    return jsonify(user.getEmailAddress(cursor, userID))
    
@app.route('/updateEmailAddress/<userID>/<emailAddress>', methods=['GET'])
def updateEmailAddress(userID, emailAddress):
    cursor = engine.connect()
    return jsonify(user.updateEmailAddress(cursor, userID, emailAddress))

@app.route('/deleteUser/<userID>', methods=['DELETE'])
def deleteUser(userID):
    cursor = engine.connect()
    user.deleteSurvey(cursor, userID)

@app.route('/getSurveys/<userID>', methods=['GET'])
def getSurveys(userID):
    cursor = engine.connect()
    return survey.getSurveys(cursor, userID)
    
@app.route('/addSurvey/<userID>/<timeCreated>', defaults={'name': ''}, methods=['POST'])
@app.route('/addSurvey/<userID>/<name>/<timeCreated>', methods=['POST'])
def addSurvey(userID, name, timeCreated):
    cursor = engine.connect()
    return survey.addSurvey(cursor, userID, name, timeCreated)

@app.route('/publishSurvey/<surveyID>', methods=['PUT'])
def publishSurvey(surveyID):
    cursor = engine.connect()
    return survey.publishSurvey(cursor, surveyID)

@app.route('/endSurvey/<surveyID>', methods=['PUT'])
def endSurvey(surveyID):
    cursor = engine.connect()
    return survey.endSurvey(cursor, surveyID)

@app.route('/getSurveyNameAndStatus/<surveyID>', methods=['GET'])
def getSurveyNameAndStatus(surveyID):
    cursor = engine.connect()
    return survey.getSurveyNameAndStatus(cursor, surveyID)

@app.route('/updateSurveyName/<surveyID>/', defaults={'surveyName': ''}, methods=['PUT'])
@app.route('/updateSurveyName/<surveyID>/<surveyName>', methods=['PUT'])
def updateSurveyName(surveyID, surveyName):
    cursor = engine.connect()
    return survey.updateSurveyName(cursor, surveyID, surveyName)

@app.route('/updateTime/<surveyID>/<time>', methods=['PUT'])
def updateTime(surveyID, time):
    cursor = engine.connect()
    return survey.updateTime(cursor, surveyID, time)

@app.route('/deleteSurvey/<surveyID>', methods=['DELETE'])
def deleteSurvey(surveyID):
    cursor = engine.connect()
    return survey.deleteSurvey(cursor, surveyID)

@app.route('/getQuestions/<surveyID>', methods=['GET'])
def getQuestions(surveyID):
    cursor = engine.connect()
    return survey.getQuestions(cursor, surveyID)

@app.route('/addQuestion/<surveyID>/<questionType>/<idx>', defaults={'prompt': ''}, methods=['POST'])
@app.route('/addQuestion/<surveyID>/<questionType>/<prompt>/<idx>', methods=['POST'])
def addQuestion(surveyID, questionType, prompt, idx):
    cursor = engine.connect()
    return survey.addQuestion(cursor, surveyID, questionType, prompt, idx)

@app.route('/addFRQ/<surveyID>/<idx>', methods=['POST'])
def addFRQ(surveyID, idx):
    cursor = engine.connect()
    return survey.addFRQ(cursor, surveyID, idx)

@app.route('/updateFRQ/<questionID>/', defaults={'prompt': ''}, methods=['PUT'])
@app.route('/updateFRQ/<questionID>/<prompt>', methods=['PUT'])
def updateFRQ(questionID, prompt):
    cursor = engine.connect()
    return survey.updateFRQ(cursor, questionID, prompt)

@app.route('/deleteFRQ/<questionID>', methods=['DELETE'])
def deleteFRQ(questionID):
    cursor = engine.connect()
    return survey.deleteFRQ(cursor, questionID)

@app.route('/addMCQ/<surveyID>/<idx>', methods=['POST'])
def addMCQ(surveyID, idx):
    cursor = engine.connect()
    return survey.addMCQ(cursor, surveyID, idx)

@app.route('/addMCQ_M/<surveyID>', methods=['GET'])
def addMCQ_M(surveyID):
    cursor = engine.connect()
    return survey.addMCQ_M(cursor, surveyID)

@app.route('/updateMCQ/<questionID>/', defaults={'prompt': ''}, methods=['PUT'])
@app.route('/updateMCQ/<questionID>/<prompt>', methods=['PUT'])
def updateMCQ(questionID, prompt):
    cursor = engine.connect()
    return survey.updateMCQ(cursor, questionID, prompt)

@app.route('/deleteMCQ/<questionID>', methods=['DELETE'])
def deleteMCQ(questionID):
    cursor = engine.connect()
    return survey.deleteMCQ(cursor, questionID)

@app.route('/getChoices/<questionID>', methods=['GET'])
def getChoices(questionID):
    cursor = engine.connect()
    return survey.getChoices(cursor, questionID)

@app.route('/addChoice/<questionID>/<idx>', defaults={'choice': ''}, methods=['POST'])
@app.route('/addChoice/<questionID>/<choice>/<idx>', methods=['POST'])
def addChoice(questionID, choice, idx):
    cursor = engine.connect()
    return survey.addChoice(cursor, questionID, choice, idx)

@app.route('/updateChoice/<choiceID>/', defaults={'choice': ''}, methods=['PUT'])
@app.route('/updateChoice/<choiceID>/<choice>', methods=['PUT'])
def updateChoice(choiceID, choice):
    cursor = engine.connect()
    return survey.updateChoice(cursor, choiceID, choice)

@app.route('/deleteChoice/<choiceID>', methods=['DELETE'])
def deleteChoice(choiceID):
    cursor = engine.connect()
    return survey.deleteChoice(cursor, choiceID)

@app.route('/getContactLists/<userID>', methods=['GET'])
def getContactLists(userID):
    cursor = engine.connect()
    return jsonify(contact.getContactLists(cursor, userID))

"""
Given a userID and a contact list name in the HTTP request, a new contact
list is created under the specific user and stored in the database

userID: the user id the new contact list will be under
contactListName: the name of the contact list
"""
@app.route('/addContactList/<userID>/<contactListName>', methods=['GET'])
def addContactList(userID, contactListName):
    cursor = engine.connect()
    return jsonify(contact.addContactList(cursor, userID, contactListName))

@app.route('/updateContactLists/<contactListID>/<contactListName>', methods=['GET'])
def updateContactListName(contactListID, contactListName):
    cursor = engine.connect()
    contact.updateContactListName(cursor, contactListID, contactListName)

@app.route('/deleteContactLists/<contactListID>', methods=['GET'])
def deleteContactList(contactListID):
    cursor = engine.connect()
    return jsonify(contact.deleteContactList(cursor, contactListID))

@app.route('/getContacts/<contactListID>', methods=['GET'])
def getContacts(contactListID):
    cursor = engine.connect()
    return jsonify(contact.getContacts(cursor, contactListID))


"""
Given a contact list id and personal information of a contact that is to be added,
add this contact to the contact list specified by the id.

contactListID: the ID of the contact list the new contact will be added to
firstName: the first name of the contact
lastName: the last name of the contact
emailAddress: the email address of the contact
"""
@app.route('/addContact/<contactListID>/<firstName>/<lastName>/<emailAddress>', methods=['GET'])
def addContact(contactListID, firstName, lastName, emailAddress):
    cursor = engine.connect()
    return jsonify(contact.addContact(cursor, contactListID, firstName, lastName, emailAddress))

@app.route('/updateContactFirstName/<contactID>/<firstName>', methods=['GET'])
def updateContactFirstName(contactID, firstName):
    cursor = engine.connect()
    contact.updateContactFirstName(cursor, contactID, firstName)

@app.route('/updateContactLastName/<userID>/<lastName>', methods=['GET'])
def updateContactLastName(contactID, lastName):
    cursor = engine.connect()
    contact.updateContactLastName(cursor, contactID, lastName)

@app.route('/updateContactEmailAddress/<contactID>/<emailAddress>', methods=['GET'])
def updateContactEmailAddress(contactID, emailAddress):
    cursor = engine.connect()
    contact.updateContactEmailAddress(cursor, contactID, emailAddress)

@app.route('/deleteContact/<contactID>', methods=['GET'])
def deleteContact(contactID):
    cursor = engine.connect()
    return jsonify(contact.deleteContact(cursor, contactID))

@app.route('/getQuestionsAndChoices/<surveyID>', methods=['GET'])
def getQuestionsAndChoices(surveyID):
    cursor = engine.connect()
    return survey.getQuestionsAndChoices(cursor, surveyID)

@app.route('/getSurveyResults/<surveyID>', methods=['GET'])
def getSurveyResults(surveyID):
    cursor = engine.connect()
    return survey.getSurveyResults(cursor, surveyID)

@app.route('/getSurveyResultsHourlyBuckets/<surveyID>', methods=['GET'])
def getSurveyResultsHourlyBuckets(surveyID):
    cursor = engine.connect()
    return survey.getSurveyResultsHourlyBuckets(cursor, surveyID)

@app.route('/addQuestionResponse/<questionID>/<timeCreated>', defaults={'response': ''}, methods=['POST'])
@app.route('/addQuestionResponse/<question_id>/<response>/<timeCreated>', methods=['POST'])
def addQuestionResponse(question_id, response, timeCreated):
    cursor = engine.connect()
    return survey.addQuestionResponse(cursor, question_id, response, timeCreated)


"""
This route is intended to provide the data structure which should contain
information about contact lists such as name and id, as well as information on all contacts contained
within that contact list (so, basically an array of names and email addresses associated with contacts)

userID: intended to serve as the user ID of the user 
the contact list information needs to be extracted from
"""
@app.route('/getContactInfo/<userID>')
def testDataStructure(userID):
    cursor = engine.connect()
    return jsonify(contact.getContactInfoDataStructure(cursor, userID))


"""
This route is intended to get a user's personal information, such as
first and last name, email, and username/password
userID: intended to serve as the user ID of the user to get info from
"""
@app.route('/getUserInfo/<userID>', methods=['GET'])
def getUserInfo(userID):
    cursor = engine.connect()
    return jsonify(user.getUserInfo(cursor, userID))

@app.route('/moveQuestion/<questionID>/<idx>', methods=['PUT'])
def moveQuestion(questionID, idx):
    cursor = engine.connect()
    return survey.moveQuestion(cursor, questionID, idx)

@app.route('/moveChoice/<choiceID>/<idx>', methods=['PUT'])
def moveChoice(choiceID, idx):
    cursor = engine.connect()
    return survey.moveChoice(cursor, choiceID, idx)

@app.route('/linkContactList/<surveyID>/<contactListID>', methods=['PUT'])
def linkContactList(surveyID, contactListID):
    cursor = engine.connect()
    return jsonify(survey.linkContactList(cursor, surveyID, contactListID))

@app.route('/sendEmail/<surveyID>/<contactListID>/<userID>', methods=['GET'])
def sendEmail(surveyID, contactListID, userID):
    cursor = engine.connect()
    return(email.sendEmail(cursor, surveyID, contactListID, userID))

@app.route('/bandaid', methods=['PUT'])
def bandaid(): #need to run after flush before demo
    cursor = engine.connect()
    survey.bandaid(cursor)

@app.route('/getSurveyResultsFiltered/<surveyID>/<startTime>/<endTime>', methods=['GET'])
def getSurveyResultsFiltered(surveyID, startTime, endTime):
    cursor = engine.connect()
    return survey.getSurveyResultsFiltered(cursor, surveyID, startTime, endTime)

@app.route('/checkEmail/<surveyID>/<email>', methods=['GET'])
def checkEmail(surveyID, email):
    cursor = engine.connect()
    return survey.checkEmail(cursor, surveyID, email)