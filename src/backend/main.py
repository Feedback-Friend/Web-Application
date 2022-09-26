from random import choices
from flask import Flask
from flask.json import jsonify
from sqlalchemy import create_engine
import sshtunnel

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
    table = cursor.execute("SELECT * FROM users")
    userID = 0
    for entry in table:
        if entry[3] == userName or entry[5] == emailAddress:
            return "-1"
        userID = entry[0]+1
    cursor.execute("INSERT INTO users VALUES(%s, %s, %s, %s, %s, %s)", (int(userID), firstName, lastName, userName, passWord, emailAddress))
    return str(userID - 1)

@app.route('/loginUser/<userName>/<passWord>', methods=['GET'])
def loginUser(userName, passWord):
    cursor = engine.connect()
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[3] == userName and entry[4] == passWord:
            return jsonify({"result": entry[0], "name": entry[1]})
    return jsonify({"result": "-1"})

@app.route('/updateChoice/<choiceID>/<prompt>', methods=['GET'])
def updateFirstName(userID, firstName):
    cursor = engine.connect()
    cursor.execute("UPDATE users SET first_name = '%s' WHERE user_id = %s", (int(firstName), userID))

@app.route('/updateChoice/<choiceID>/<prompt>', methods=['GET'])
def updateLastName(userID, lastName):
    cursor = engine.connect()
    cursor.execute("UPDATE users SET last_name = '%s' WHERE user_id = %s", (int(lastName), userID))

@app.route('/updateChoice/<choiceID>/<prompt>', methods=['GET'])
def updateEmailAddress(userID, emailAddress):
    cursor = engine.connect()
    cursor.execute("UPDATE users SET email_address = '%s' WHERE user_id = %s", (int(emailAddress), userID))

@app.route('/updateChoice/<choiceID>/<prompt>', methods=['GET'])
def updateUserName(userID, userName):
    cursor = engine.connect()
    cursor.execute("UPDATE users SET user_name = '%s' WHERE user_id = %s", (int(userName), userID))

@app.route('/updateChoice/<choiceID>/<prompt>', methods=['GET'])
def updatePassWord(userID, passWord):
    cursor = engine.connect()
    cursor.execute("UPDATE users SET pass_word = '%s' WHERE user_id = %s", (int(passWord), userID))

@app.route('/getSurveys/<userID>/', methods=['GET'])
def getSurveys(userID):
    cursor = engine.connect()
    table = cursor.execute("SELECT * FROM surveys WHERE user_id='%s'", (str(userID)))
    surveys = []
    for entry in table:
        question = cursor.execute("SELECT * FROM questions WHERE survey_id='%s' LIMIT 1", (str(entry[0]))) #get single question
        responses = cursor.execute("SELECT * FROM responeses WHERE question_id='%s'", (str(question[0]))) #get responses to question
        count = 0
        for row in responses:
            count = count + 1
        surveys.append(entry[0]+"_"+entry[3]+"_"+count) #return survey id, name, and responses
    return surveys
      
@app.route('/addSurvey/<userID>/<surveyName>', methods=['GET'])
def addSurvey(userID, surveyName):
    cursor = engine.connect()
    table = cursor.execute("SELECT * FROM surveys")
    surveyID = 0
    for entry in table:
        if entry[3] == surveyName:
            return "-1"
        surveyID = entry[0]+1
    cursor.execute("INSERT INTO surveys VALUES(%s, %s, %s, %s)", (int(userID), int(surveyID), "-1", surveyName))
    return surveyID

@app.route('/deleteSurvey/<surveyID>', methods=['GET'])
def deleteSurvey(surveyID):
    cursor = engine.connect()
    table = cursor.execute("SELECT * FROM questions WHERE survey_id='%s'", (str(surveyID)))
    for entry in table:
        if entry[1] == surveyID:
                cursor.execute("DELETE FROM choices WHERE question_id = %s",(entry[1]))
                cursor.execute("DELETE FROM responses WHERE question_id = %s",(entry[1]))
    cursor.execute("DELETE FROM questions WHERE survey_id = %s",(surveyID))
    cursor.execute("DELETE FROM surveys WHERE survey_id = %s",(surveyID))

@app.route('/getQuestions/<surveyID>/', methods=['GET'])
def getQuestions(surveyID):
    cursor = engine.connect()
    table = cursor.execute("SELECT * FROM questions WHERE survey_id='%s'", (str(surveyID)))
    questions = []
    for entry in table:
        questions.append(entry[0]+"_"+entry[3]) #return question id and prompt
    return questions

@app.route('/addFRQ/<surveyID>', methods=['GET'])
def addFRQ(surveyID):
    cursor = engine.connect()
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), 0, ""))
    return questionID

@app.route('/updateFRQ/<questionID>/<prompt>', methods=['GET'])
def updateFRQ(questionID, prompt):
    cursor = engine.connect()
    cursor.execute("UPDATE questions SET prompt = '%s' WHERE question_id = %s", (int(questionID), prompt))

@app.route('/deleteFRQ/<questionID>', methods=['GET'])
def deleteFRQ(questionID):
    cursor = engine.connect()
    cursor.execute("DELETE FROM questions WHERE question_id = %s", (int(questionID)))

@app.route('/addMCQ_S/<surveyID>', methods=['GET'])
def addMCQ_S(surveyID):
    cursor = engine.connect()
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), 1, ""))
    return questionID

@app.route('/addMCQ_M/<surveyID>', methods=['GET'])
def addMCQ_M(surveyID):
    cursor = engine.connect()
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), 2, ""))
    return questionID

@app.route('/updateMCQ/<questionID>/<prompt>', methods=['GET'])
def updateMCQ(questionID, prompt):
    cursor = engine.connect()
    cursor.execute("UPDATE questions SET prompt = '%s' WHERE question_id = %s", (int(questionID), prompt))

@app.route('/deleteMCQ/<questionID>', methods=['GET'])
def deleteMCQ(questionID):
    cursor = engine.connect()
    cursor.execute("DELETE FROM questions WHERE question_id = %s", (int(questionID)))

@app.route('/getChoices/<questionID>/', methods=['GET'])
def getChoices(questionID):
    cursor = engine.connect()
    table = cursor.execute("SELECT * FROM choices WHERE question_id='%s'", (str(questionID)))
    choices = []
    for entry in table:
        choices.append(entry[0]+"_"+entry[2]) #return choice id and answer
    return choices

@app.route('/addChoice/<questionID>', methods=['GET'])
def addChoice(questionID):
    cursor = engine.connect()
    table = cursor.execute("SELECT * FROM choices")
    choiceID = 0
    for entry in table:
        choiceID = entry[0]+1
    cursor.execute("INSERT INTO choices VALUES(%s, %s, %s)", (int(choiceID), int(questionID), ""))
    return choiceID

@app.route('/updateChoice/<choiceID>/<prompt>', methods=['GET'])
def updateChoice(choiceID, prompt):
    cursor = engine.connect()
    cursor.execute("UPDATE choices SET prompt = '%s' WHERE choice_id = %s", (int(choiceID), prompt))

@app.route('/deleteChoice/<choiceID>', methods=['GET'])
def deleteChoice(choiceID):
    cursor = engine.connect()
    cursor.execute("DELETE FROM choices WHERE choice_id = %s", (int(choiceID)))

  