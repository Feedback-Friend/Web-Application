from flask import Flask
from flask.json import jsonify

def registerUser(cursor, firstName, lastName, userName, passWord, emailAddress):
    table = cursor.execute("SELECT * FROM users")
    userID = 0
    for entry in table:
        if entry[3] == userName or entry[5] == emailAddress:
            return "-1"
        userID = entry[0]+1
    cursor.execute("INSERT INTO users VALUES(%s, %s, %s, %s, %s, %s)", (int(userID), firstName, lastName, userName, passWord, emailAddress))
    return str(userID) #used to say userID -1 not sure if that was right

def loginUser(cursor, userName, passWord):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[3] == userName and entry[4] == passWord:
            return jsonify({"result": entry[0], "name": entry[1]})
    return jsonify({"result": "-1"})

def updateFirstName(cursor, userID, firstName):
    cursor.execute("UPDATE users SET first_name = '%s' WHERE user_id = %s", (int(firstName), userID))

def updateLastName(cursor, userID, lastName):
    cursor.execute("UPDATE users SET last_name = '%s' WHERE user_id = %s", (int(lastName), userID))

def updateEmailAddress(cursor, userID, emailAddress):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[5] == emailAddress:
            return "-1"
    cursor.execute("UPDATE users SET email_address = '%s' WHERE user_id = %s", (int(emailAddress), userID))

def updateUserName(cursor, userID, userName):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[3] == userName :
            return "-1"
    cursor.execute("UPDATE users SET user_name = '%s' WHERE user_id = %s", (int(userName), userID))

def updatePassWord(cursor, userID, passWord):
    cursor.execute("UPDATE users SET pass_word = '%s' WHERE user_id = %s", (int(passWord), userID))