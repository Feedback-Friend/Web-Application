from flask import Flask
from flask.json import jsonify

from surveys import *
from contacts import *


"""
Registers a user into the SQL database

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
firstName (String): user's first name
lastName (String): user's last name
userName (String): user's username
passWord (String): user's password
emailAddress (String): user's email address

returns 1 if registration success, else -1
"""
def registerUser(cursor, firstName, lastName, userName, passWord, emailAddress):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:  # validate if user already exists
        if entry[3] == userName or entry[5] == emailAddress:
            return "-1"  # no duplicate usernames or emails
    cursor.execute("INSERT INTO users (first_name, last_name, user_name, pass_word, email_address) VALUES(%s, %s, %s, %s, %s)", (firstName, lastName, userName, passWord, emailAddress))
    return 1 #used to say userID -1 not sure if that was right


"""
Attempts to log a user into the database by looking for a username and password match

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userName (String): user's username
passWord (String): user's password

returns: (int) user id of the logged in user, (String) name of the logged in user
if login is unsuccessful, return -1
"""
def loginUser(cursor, userName, passWord):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[3] == userName and entry[4] == passWord:
            return entry[0], entry[1] # id, name
    return -1 # invalid login


"""
Gets a user's first name

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user queried

returns: (String) user's first name if user is found
else, returns (int) -1
"""
def getFirstName(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return entry[1]
    return -1


"""
Sets a user's firstName to a new firstName

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user queried
firstName(String): the new firstName

returns: (int) 1 if successful, -1 if unsuccessful
"""
def updateFirstName(cursor, userID, firstName):
    cursor.execute("UPDATE users SET first_name = %s WHERE user_id = %s", (firstName, int(userID)))
    return 1


"""
Gets a user's last name

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user queried

returns: (String) user's last name if user is found
else, returns (int) -1
"""
def getLastName(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return entry[2]
    return -1


"""
Sets a user's lastName to a new lastName

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user queried
lastName(String): the new lastName

returns: (int) 1 if successful, -1 if unsuccessful
"""
def updateLastName(cursor, userID, lastName):
    cursor.execute("UPDATE users SET last_name = %s WHERE user_id = %s", (lastName, int(userID)))
    return 1


"""
Gets a user's username

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user queried

returns: (String) user's username if user is found
else, returns (int) -1
"""
def getUserName(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return entry[3]
    return -1


"""
Sets a user's userName to a new userName

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user queried
userName(String): the new userName

returns: (int) 1 if successful, -1 if unsuccessful
"""
def updateUserName(cursor, userID, userName):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[3] == userName :
            return "-1"
    cursor.execute("UPDATE users SET user_name = %s WHERE user_id = %s", (userName, int(userID)))
    return 1


"""
Gets a user's password

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user queried

returns: (String) user's password if user is found
else, returns (int) -1
"""
def getPassWord(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return entry[4]
    return -1


"""
Sets a user's passWord to a new passWord

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user queried
passWord(String): the new passWord

returns: (int) 1 if successful, -1 if unsuccessful
"""
def updatePassWord(cursor, userID, passWord):
    cursor.execute("UPDATE users SET pass_word = %s WHERE user_id = %s", (passWord, int(userID)))
    return 1


"""
Gets a user's email address

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user queried

returns: (String) user's email address if user is found
else, returns (int) -1
"""
def getEmailAddress(cursor, userID):
    user=cursor.execute("SELECT * FROM users WHERE user_id = %s", (int(userID)))
    for entry in user:
        return entry[5]
    return -1


"""
Sets a user's emailAddress to a new emailAddress

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user queried
emailAddress(String): the new emailAddress

returns: (int) 1 if successful, -1 if unsuccessful
"""
def updateEmailAddress(cursor, userID, emailAddress):
    table = cursor.execute("SELECT * FROM users")
    for entry in table:
        if entry[5] == emailAddress:
            return "-1"
    cursor.execute("UPDATE users SET email_address = %s WHERE user_id = %s", (emailAddress, int(userID)))
    return 1


"""
Deletes all information pertaining to a user from the database
Deletes surveys, contact lists, and the user record

cursor (SQLAlchemy cursor) the cursor pointing to the SQL database
userID (int): the user id of the user to be deleted

returns: (int) 1 if successful, else errors out
"""
def deleteUser(cursor, userID):
    survey_table = cursor.execute("SELECT * FROM surveys WHERE user_id = %s", (int(userID)))
    for entry in survey_table:
        deleteSurvey(cursor, entry[0])
    CL_table = cursor.execute("SELECT * FROM contact_lists WHERE contact_list_id = %s", (int(userID)))
    for entry in CL_table:
        deleteContactList(cursor, entry[0])
    
    # delete user from users table
    cursor.execute("DELETE FROM users WHERE user_id = %s", (int(userID)))
    return 1
