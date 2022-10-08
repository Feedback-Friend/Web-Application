from flask import Flask
from flask.json import jsonify

from survey import *
from contact import *

def registerUser(cursor, firstName, lastName, userName, passWord, emailAddress):
    table = cursor.execute("SELECT * FROM users")
    userID = 0
    for entry in table:  # validate if user already exists
        if entry[3] == userName or entry[5] == emailAddress:
            return "-1"  # no duplicate usernames or emails
        userID = entry[0]+1
    cursor.execute("INSERT INTO users (first_name, last_name, user_name, pass_word, email_address) VALUES(%s, %s, %s, %s, %s)", (firstName, lastName, userName, passWord, emailAddress))
    return str(userID) #used to say userID -1 not sure if that was right

def loginUser(cursor, userName, passWord):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[3] == userName and entry[4] == passWord:
            return entry[0], entry[1] # id, name
    return "Error: Not Found" # invalid login

def getFirstName(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return entry[1]

def updateFirstName(cursor, userID, firstName):
    cursor.execute("UPDATE users SET first_name = %s WHERE user_id = %s", (firstName, int(userID)))
    return "Success"

def getLastName(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return entry[2]

def updateLastName(cursor, userID, lastName):
    cursor.execute("UPDATE users SET last_name = %s WHERE user_id = %s", (lastName, int(userID)))

def getUserName(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return entry[3]

def updateUserName(cursor, userID, userName):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[3] == userName :
            return "-1"
    cursor.execute("UPDATE users SET user_name = %s WHERE user_id = %s", (userName, int(userID)))

def getPassWord(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return entry[4]
        
def updatePassWord(cursor, userID, passWord):
    cursor.execute("UPDATE users SET pass_word = %s WHERE user_id = %s", (passWord, int(userID)))

def getEmailAddress(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return entry[5]

def updateEmailAddress(cursor, userID, emailAddress):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[5] == emailAddress:
            return "-1"
    cursor.execute("UPDATE users SET email_address = %s WHERE user_id = %s", (emailAddress, int(userID)))

def deleteUser(cursor, userID):
    table = cursor.execute("SELECT * FROM surveys WHERE user_id = %s", (int(userID)))
    for entry in table:
        deleteSurvey(cursor, entry[0])
    table = cursor.execute("SELECT * FROM contact_lists WHERE contact_list_id = %s", (int(userID)))
    for entry in table:
        deleteContactList(cursor, entry[0])
