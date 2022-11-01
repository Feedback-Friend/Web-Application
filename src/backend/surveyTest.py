from flask import Flask
from flask.json import jsonify

def getSurveys(cursor, userID):
    table = cursor.execute("SELECT * FROM surveys WHERE user_id=%s", (str(userID)))
    surveys = []
    for entry in table:
        count = 0
        questions = cursor.execute("SELECT * FROM questions WHERE survey_id=%s LIMIT 1", (str(entry[0]))) #get single question
        for question in questions:
            responses = cursor.execute("SELECT * FROM responses WHERE question_id=%s", (str(question[0]))) #get responses to question
            for response in responses:
                count = count + 1
        surveys.append({"id": entry[0], "name": entry[3], "count": count, "time": entry[4]}) #return survey id, name, and responses
    return surveys
      
def addSurvey(cursor, userID, contact_list_id, surveyName, timeCreated):
    table = cursor.execute("SELECT * FROM surveys")
    surveyID = 0
    for entry in table:
        surveyID = entry[0]+1
    cursor.execute("INSERT INTO surveys VALUES(%s, %s, %s, %s, %s)", (int(surveyID), int(userID), int(contact_list_id), surveyName, timeCreated))
    return 1

def UpdateSurveyName(cursor, surveyID, surveyName):
    cursor.execute("UPDATE surveys SET survey_name = %s WHERE survey_id = %s", (surveyName, int(surveyID)))
    return 1

def deleteSurvey(cursor, surveyID):
    table = cursor.execute("SELECT * FROM questions WHERE survey_id=%s", (str(surveyID)))
    for entry in table:
            cursor.execute("DELETE FROM choices WHERE question_id = %s",(entry[0]))
            cursor.execute("DELETE FROM responses WHERE question_id = %s",(entry[0]))
    cursor.execute("DELETE FROM questions WHERE survey_id = %s",(str(surveyID)))
    cursor.execute("DELETE FROM surveys WHERE survey_id = %s",(str(surveyID)))
    return jsonify({'result': 0})

def getQuestions(cursor, surveyID):
    table = cursor.execute("SELECT * FROM questions WHERE survey_id=%s", (str(surveyID)))
    questions = []
    for entry in table:
        questions.append({'id': entry[0], 'type': entry[2], 'prompt': entry[3]}) #return question id and prompt
    return questions

def addQuestion(cursor, surveyID, questionType, prompt):
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), int(questionType), prompt))
    return {'result': questionID}

def addFRQ(cursor, surveyID):
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), 0, ""))
    return questionID

def updateFRQ(cursor, questionID, prompt):
    cursor.execute("UPDATE questions SET prompt = %s WHERE question_id = %s", (prompt, int(questionID)))
    return 1

def deleteFRQ(cursor, questionID):
    cursor.execute("DELETE FROM questions WHERE question_id = %s", (int(questionID)))
    return 1

def addMCQ_S(cursor, surveyID):
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), 1, ""))
    return questionID

def addMCQ_M(cursor, surveyID):
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), 2, ""))
    return questionID

def updateMCQ(cursor, questionID, prompt):
    cursor.execute("UPDATE questions SET prompt = %s WHERE question_id = %s", (prompt, int(questionID)))
    return 1

def deleteMCQ(cursor, questionID):
    cursor.execute("DELETE FROM questions WHERE question_id = %s", (int(questionID)))
    return 1

def getChoices(cursor, questionID):
    table = cursor.execute("SELECT * FROM choices WHERE question_id=%s", (str(questionID)))
    choices = []
    for entry in table:
        choices.append({"id": entry[0], "choice": entry[2]}) #return choice id and answer
    return choices

def addChoice(cursor, questionID, prompt):
    table = cursor.execute("SELECT * FROM choices")
    choiceID = 0
    for entry in table:
        choiceID = entry[0]+1
    cursor.execute("INSERT INTO choices VALUES(%s, %s, %s)", (int(choiceID), int(questionID), prompt))
    return 1

def updateChoice(cursor, choiceID, prompt):
    cursor.execute("UPDATE choices SET choice = %s WHERE choice_id = %s", (prompt, int(choiceID)))
    return 1

def deleteChoice(cursor, choiceID):
    cursor.execute("DELETE FROM choices WHERE choice_id = %s", (int(choiceID)))
    return 1

def getQuestionsAndChoices(cursor, surveyID):
    table = cursor.execute("SELECT * FROM questions WHERE survey_id=%s", (str(surveyID)))
    questions = []
    for entry in table:
        choices_ary = []
        choices = cursor.execute("SELECT * FROM choices WHERE question_id=%s",(str(entry[0])))
        for choice in choices:
            choices_ary.append({"id": choice[0], "choice": choice[2]}) #return choice id and answer
        questions.append({'id': entry[0], 'type': entry[2], 'prompt': entry[3], 'choices': choices_ary})
    return questions