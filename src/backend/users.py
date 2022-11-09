from flask import Flask
from flask.json import jsonify

from src.backend.surveys import *
from src.backend.contacts import *


"""
Given user information, attempts to register the user and returns the user ID if registration is successful.
"""
def registerUser(cursor, firstName, lastName, userName, passWord, emailAddress):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:  # validate if user already exists
        if entry[3] == userName or entry[5] == emailAddress:
            return "-1"  # no duplicate usernames or emails
    cursor.execute("INSERT INTO users (first_name, last_name, user_name, pass_word, email_address) VALUES(%s, %s, %s, %s, %s)", (firstName, lastName, userName, passWord, emailAddress))
    print("Success")
    # return the userID of the user just registered
    user_result = cursor.execute("SELECT * FROM users WHERE user_name = %s AND email_address = %s", (userName, emailAddress))
    for user in user_result:
        return user[0]
    return "-1"  # should never happen


def loginUser(cursor, userName, passWord):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[3] == userName and entry[4] == passWord:
            print("Success")
            return {"result": entry[0], "name": entry[1]}  # match
    print("Error: Not Found")
    return {"result": "-1"}  # invalid login

def getFirstName(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        print(entry[1])
        return {"first_name":entry[1]}

def updateFirstName(cursor, userID, firstName):
    cursor.execute("UPDATE users SET first_name = %s WHERE user_id = %s", (firstName, int(userID)))

def getLastName(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return {"last_name":entry[2]}

def updateLastName(cursor, userID, lastName):
    cursor.execute("UPDATE users SET last_name = %s WHERE user_id = %s", (lastName, int(userID)))

def getUserName(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return {"user_name":entry[3]}

def updateUserName(cursor, userID, userName):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[3] == userName :
            return "-1"
    cursor.execute("UPDATE users SET user_name = %s WHERE user_id = %s", (userName, int(userID)))
    return "1"

def getPassWord(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return {"password":entry[4]}

def updatePassWord(cursor, userID, passWord):
    cursor.execute("UPDATE users SET pass_word = %s WHERE user_id = %s", (passWord, int(userID)))

def getEmailAddress(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return {"email":entry[5]}

def updateEmailAddress(cursor, userID, emailAddress):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[5] == emailAddress:
            return "-1"
    cursor.execute("UPDATE users SET email_address = %s WHERE user_id = %s", (emailAddress, int(userID)))
    return "1"

def deleteUser(cursor, userID):
    # also need to delete all surveys, contacts, and contact lists associated with the user

    # first, delete all surveys associated with the user
    table = cursor.execute("SELECT * FROM surveys WHERE user_id = %s", (int(userID)))
    for entry in table:
        deleteSurvey(cursor, entry[0])

    # then, delete all contact lists associated with the user
    table = cursor.execute("SELECT * FROM contact_lists WHERE contact_list_id = %s", (int(userID)))
    for entry in table:
        deleteContactList(cursor, entry[0])

def getUserInfo(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        userInfo = {"firstName": entry[1], "lastName": entry[2], "username": entry[3], "password": "fake", "email": entry[5]} #first, last, user, pass, email
        return userInfo