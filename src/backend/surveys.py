from flask import Flask
from flask.json import jsonify
import pandas

"""
Return each survey and the number of people who responded to that survey
Javascript date object? Or date like "10-17-2022"
"""
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
        surveys.append({"id": entry[0], "contactListID": entry[2], "name": entry[3], "count": count, "status": entry[4], "time": entry[5]}) #return survey id, name, and responses
    return jsonify(surveys)

def getSurveyResults(cursor, surveyID):
    question_list = []
    questions = cursor.execute("SELECT * FROM questions WHERE survey_id=%s", (int(surveyID))) #get single question
    for entry in questions:
        responses = cursor.execute("SELECT * FROM responses WHERE question_id=%s", (str(entry[0]))) #get responses to question
        response_list = []
        for response in responses:
            response_list.append(response)    
        question_list.append({"id": entry[0], "type": entry[2], "prompt": entry[3], "response_list": [dict(row) for row in response_list]}) #return question id, type, prompt, and responses
    return jsonify(question_list)

def getSurveyResultsHourlyBuckets(cursor, surveyID):
    question_list = []
    hourly_results = []
    questions = cursor.execute("SELECT * FROM questions WHERE survey_id=%s", (int(surveyID))) #get single question
    for entry in questions:
        hours = cursor.execute("select group_concat(DATE_FORMAT(FROM_UNIXTIME(time_created/1000),'%%Y-%%m-%%d %%H')), COUNT(1) from responses where question_id=%s group by DATE_FORMAT(FROM_UNIXTIME(time_created/1000),'%%Y %%D %%M %%H');", (str(entry[0]))) #get responses to question
        response_list = {}
        times = []
        for hour in hours:
            response_list[hour[0].split(',')[0]] = hour[1]
            times.append(hour[0].split(','))
        hourly_results.append(response_list)
    times_list = [item for sublist in times for item in sublist]
    time_range = pandas.date_range(min(times_list), max(times_list), freq='H').strftime("%Y-%m-%d %H").tolist()    
    return jsonify({"hours": hourly_results[0], "time_range": time_range})

def getSurveyResultsFiltered(cursor, surveyID, startTime, endTime):
    question_list = []
    questions = cursor.execute("SELECT * FROM questions WHERE survey_id=%s", (int(surveyID))) #get single question
    for entry in questions:
        responses = cursor.execute("SELECT * FROM responses WHERE question_id=%s", (str(entry[0]))) #get responses to question
        response_list = []
        for response in responses:
            if(response[3]>int(startTime) and response[3]<int(endTime)):
                response_list.append(response) 
        question_list.append({"id": entry[0], "type": entry[2], "prompt": entry[3], "response_list": [dict(row) for row in response_list]}) #return question id, type, prompt, and responses
    return jsonify(question_list)
      
def addSurvey(cursor, userID, name, timeCreated):
    table = cursor.execute("SELECT * FROM surveys")
    cursor.execute("INSERT INTO surveys (user_id, contact_list_id, survey_name, status, time_created) VALUES(%s, %s, %s, %s, %s)", (int(userID), "-1", name, "0", timeCreated))
    survey_result = cursor.execute("SELECT * FROM surveys WHERE user_id = %s AND time_created = %s", (int(userID), timeCreated))
    for survey in survey_result:
        return jsonify({'result': survey[0]})

def publishSurvey(cursor, surveyID):
    cursor.execute("UPDATE surveys SET status = 1 WHERE survey_id = %s", (int(surveyID)))
    return jsonify({'result': 0})

def endSurvey(cursor, surveyID):
    cursor.execute("UPDATE surveys SET status = 2 WHERE survey_id = %s", (int(surveyID)))
    return jsonify({'result': 0})

def getSurveyNameAndStatus(cursor, surveyID):
    table = cursor.execute("SELECT survey_name, status from surveys where survey_id = %s", (int(surveyID)))
    name = ""
    status = 0
    for entry in table:
        name = entry[0]
        status = entry[1]
    return jsonify({'name': name, 'status': status})

def updateSurveyName(cursor, surveyID, surveyName):
    cursor.execute("UPDATE surveys SET survey_name = %s WHERE survey_id = %s", (surveyName, int(surveyID)))
    return jsonify({'result': 0})

def updateTime(cursor, surveyID, time):
    cursor.execute("UPDATE surveys set time_created = %s WHERE survey_id = %s", (time, int(surveyID)))
    return jsonify({'result': 0})

def deleteSurvey(cursor, surveyID):
    table = cursor.execute("SELECT * FROM questions WHERE survey_id=%s", (str(surveyID)))
    for entry in table:
            cursor.execute("DELETE FROM choices WHERE question_id = %s",(entry[0]))
            cursor.execute("DELETE FROM responses WHERE question_id = %s",(entry[0]))
    cursor.execute("DELETE FROM questions WHERE survey_id = %s",(str(surveyID)))
    cursor.execute("DELETE FROM surveys WHERE survey_id = %s",(str(surveyID)))
    return jsonify({'result': 0})

def getQuestions(cursor, surveyID):
    table = cursor.execute("SELECT * FROM questions WHERE survey_id=%s ORDER BY idx", (str(surveyID)))
    questions = []
    for entry in table:
        questions.append({'id': entry[0], 'type': entry[2], 'prompt': entry[3]}) #return question id and prompt
    return jsonify(questions)

def addQuestion(cursor, surveyID, questionType, prompt, idx):
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s, %s)", (int(questionID), int(surveyID), int(questionType), prompt, idx))
    return jsonify({'result': questionID})

def addFRQ(cursor, surveyID, idx):
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s, %s)", (int(questionID), int(surveyID), 0, "", idx))
    return jsonify({'result': questionID})

def updateFRQ(cursor, questionID, prompt):
    cursor.execute("UPDATE questions SET prompt = %s WHERE question_id = %s", (prompt, int(questionID)))
    return jsonify({'result': 0})

def deleteFRQ(cursor, questionID):
    cursor.execute("DELETE FROM questions WHERE question_id = %s", (int(questionID)))
    return jsonify({'result': 0})

def addMCQ(cursor, surveyID, idx):
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s, %s)", (int(questionID), int(surveyID), 1, "", idx))
    return jsonify({'result': questionID})

def addMCQ_M(cursor, surveyID):
    table = cursor.execute("SELECT * FROM questions")
    questionID = 0
    for entry in table:
        questionID = entry[0]+1
    cursor.execute("INSERT INTO questions VALUES(%s, %s, %s, %s)", (int(questionID), int(surveyID), 2, ""))
    return questionID

def updateMCQ(cursor, questionID, prompt):
    cursor.execute("UPDATE questions SET prompt = %s WHERE question_id = %s", (prompt, int(questionID)))
    return jsonify({'result': 0})

def deleteMCQ(cursor, questionID):
    cursor.execute("DELETE FROM questions WHERE question_id = %s", (int(questionID)))
    cursor.execute("DELETE FROM choices WHERE question_id = %s", (int(questionID)))
    return jsonify({'result': 0})

def getChoices(cursor, questionID):
    table = cursor.execute("SELECT * FROM choices WHERE question_id=%s ORDER BY idx", (str(questionID)))
    choices = []
    for entry in table:
        choices.append({"id": entry[0], "choice": entry[2]}) #return choice id and answer
    return choices

def addChoice(cursor, questionID, choice, idx):
    table = cursor.execute("SELECT * FROM choices")
    choiceID = 0
    for entry in table:
        choiceID = entry[0]+1
    cursor.execute("INSERT INTO choices VALUES(%s, %s, %s, %s)", (int(choiceID), int(questionID), choice, idx))
    return jsonify({'result': choiceID})

def updateChoice(cursor, choiceID, choice):
    cursor.execute("UPDATE choices SET choice = %s WHERE choice_id = %s", (choice, int(choiceID)))
    return jsonify({'result': 0})

def deleteChoice(cursor, choiceID):
    cursor.execute("DELETE FROM choices WHERE choice_id = %s", (int(choiceID)))
    return jsonify({'result': 0})

def getQuestionsAndChoices(cursor, surveyID):
    table = cursor.execute("SELECT * FROM questions WHERE survey_id=%s ORDER BY idx", (str(surveyID)))
    questions = []
    for entry in table:
        choices_ary = []
        choices = cursor.execute("SELECT * FROM choices WHERE question_id=%s ORDER BY idx",(str(entry[0])))
        for choice in choices:
            choices_ary.append({"id": choice[0], "choice": choice[2]}) #return choice id and answer
        questions.append({'id': entry[0], 'type': entry[2], 'prompt': entry[3], 'choices': choices_ary})
    return jsonify(questions)

def addQuestionResponse(cursor, question_id, response, timeCreated):
    table = cursor.execute("SELECT * FROM responses")
    cursor.execute("INSERT INTO responses (question_id, reply, time_created) VALUES(%s, %s, %s)", (int(question_id), response, timeCreated))
    return jsonify({'result': response})


"""
Given a surveyID and a contactListID, link the corresponding survey to the contact list

return 'success' if successful, 'failure' if not
"""
def linkContactList(cursor, surveyID, contactListID):
    try:
        cursor.execute("UPDATE surveys SET contact_list_id = %s WHERE survey_id = %s", (int(contactListID), int(surveyID)))
        return {'message': 'success'}
    except:
        return {'message': 'failure'}

def moveQuestion(cursor, questionID, idx):
    cursor.execute("UPDATE questions SET idx = %s WHERE question_id = %s", (idx, int(questionID)))
    return jsonify({'result': 0})

def moveChoice(cursor, choiceID, idx):
    cursor.execute("UPDATE choices SET idx = %s WHERE choice_id = %s", (idx, int(choiceID)))
    return jsonify({'result': 0})

def bandaid(cursor):
    table = cursor.execute("SELECT * FROM surveys")
    if table.size() == 0:
        cursor.execute("INSERT INTO surveys VALUES(-1, -1, -1, -1, -1, -1)")

def checkEmail(cursor, surveyID, email):
    result = "failure"
    contactListID = -1
    table = cursor.execute("SELECT contact_list_id from surveys WHERE survey_id=%s", str(surveyID))
    for entry in table:
        contactListID = entry[0]
    table = cursor.execute("SELECT email_address from contacts WHERE contact_list_id=%s", str(contactListID))
    for entry in table:
        if entry[0] == email:
            result = "success"
    return jsonify({'result': result})