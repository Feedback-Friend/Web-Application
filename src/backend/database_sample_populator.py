from userTest import *
from surveyTest import *
from contactTest import *


"""
Adds test users to the SQL database

cursor (SQL alchemy cursor): the SQL alchemy cursor pointing to the SQL database
"""
def populateTestUsers(cursor):
    registerUser(cursor, "Kevin", "Li", "kevinli22527", "kli1", "kevinli22527@yahoo.com") #1
    registerUser(cursor, "Bob", "James", "bj", "password", "bj@yahoo.com") #2
    registerUser(cursor, "Billy", "Bo", "bb", "password!", "bb@yahoo.com") #3
    registerUser(cursor, "Jack", "Hills", "jh", "password!!!", "jh@yahoo.com") #4
    registerUser(cursor, "Hugo", "Lee", "hlee", "pass", "h@yahoo.com") #5
    testUsers(cursor)

def testUsers(cursor):
    testgetFirstName(cursor)
    testupdateFirstName(cursor)
    testgetLastName(cursor)
    testupdateLastName(cursor)
    testgetUserName(cursor)
    testgetPassWord(cursor)
    testupdatePassWord(cursor)
    testgetEmailAddress(cursor)
    testupdateEmailAddress(cursor)
    testdeleteUser(cursor)
    testgetUserInfo(cursor)

def testgetFirstName(cursor):
    assert getFirstName(cursor, 1) == "Kevin"
    assert getFirstName(cursor, 2) == "Bob"
    assert getFirstName(cursor, 3) == "Billy"
    assert getFirstName(cursor, 4) == "Jack"
    assert getFirstName(cursor, 5) == "Hugo"

def testupdateFirstName(cursor):
    updateFirstName(cursor, 2, "Bob2")
    assert getFirstName(cursor, 2) == "Bob2"
    updateFirstName(cursor, 2, "Bob")
    assert getFirstName(cursor, 2) == "Bob"

def testgetLastName(cursor):
    assert getLastName(cursor, 1) == "Li"
    assert getLastName(cursor, 2) == "James"
    assert getLastName(cursor, 3) == "Bo"
    assert getLastName(cursor, 4) == "Hills"
    assert getLastName(cursor, 5) == "Lee"

def testupdateLastName(cursor):
    updateLastName(cursor, 2, "James2")
    assert getLastName(cursor, 2) == "James2"
    updateLastName(cursor, 2, "James")
    assert getLastName(cursor, 2) == "James"

def testgetUserName(cursor):
    assert getUserName(cursor, 1) == "kevinli22527"
    assert getUserName(cursor, 2) == "bj"
    assert getUserName(cursor, 3) == "bb"
    assert getUserName(cursor, 4) == "jh"
    assert getUserName(cursor, 5) == "hlee"

def testupdateUserName(cursor):
    updateUserName(cursor, 2, "bj2")
    assert getUserName(cursor, 2) == "bj2"
    updateUserName(cursor, 2, "bj")
    assert getUserName(cursor, 2) == "bj"  

def testgetPassWord(cursor):
    assert getPassWord(cursor, 1) == "kli1"
    assert getPassWord(cursor, 2) == "password"
    assert getPassWord(cursor, 3) == "password!"
    assert getPassWord(cursor, 4) == "password!!!"
    assert getPassWord(cursor, 5) == "pass"

def testupdatePassWord(cursor):
    updatePassWord(cursor, 2, "password1")
    assert getPassWord(cursor, 2) == "password1"
    updatePassWord(cursor, 2, "password")
    assert getPassWord(cursor, 2) == "password"  

def testgetEmailAddress(cursor):
    assert getEmailAddress(cursor, 1) == "kevinli22527@yahoo.com"
    assert getEmailAddress(cursor, 2) == "bj@yahoo.com"
    assert getEmailAddress(cursor, 3) == "bb@yahoo.com"
    assert getEmailAddress(cursor, 4) == "jh@yahoo.com"
    assert getEmailAddress(cursor, 5) == "h@yahoo.com"

def testupdateEmailAddress(cursor):
    updateEmailAddress(cursor, 2, "j@yahoo.com")
    assert getEmailAddress(cursor, 2) == "j@yahoo.com"
    updateEmailAddress(cursor, 2, "bj@yahoo.com")
    assert getEmailAddress(cursor, 2) == "bj@yahoo.com"  

def testdeleteUser(cursor):
    deleteUser(cursor, 5)
    assert getEmailAddress(cursor, 5) == -1
    assert getFirstName(cursor, 5) == -1

def testgetUserInfo(cursor):
    assert getUserInfo(cursor, 2)["firstName"] == "Bob"
    assert getUserInfo(cursor, 2)["lastName"] == "James"
    assert getUserInfo(cursor, 2)["username"] == "bj"
    assert getUserInfo(cursor, 2)["password"] == "password"
    assert getUserInfo(cursor, 2)["email"] == "bj@yahoo.com"

"""
Adds test contact lists to the SQL database

cursor (SQL alchemy cursor): the SQL alchemy cursor pointing to the SQL database
"""
def populateContactLists(cursor):
    # Kevin
    addContactList(cursor, 1, "Kevin Contact List 1")

    # Bob has no contact lists

    # Billy
    addContactList(cursor, 3, "Billy Contact List 1")

    # Jack
    addContactList(cursor, 4, "Jack Contact List 1")
    addContactList(cursor, 4, "Jack Contact List 2")

    # Hugo
    addContactList(cursor, 5, "Hugo Contact List 1")


"""
Adds test contacts to the SQL database

cursor (SQL alchemy cursor): the SQL alchemy cursor pointing to the SQL database
"""
def populateContacts(cursor):
    # Kevin Contact List 1
    addContact(cursor, 1, "Billy", "Bob", "bbx@utexas.edu")
    addContact(cursor, 1, "Silly", "Sob", "ssx@utexas.edu")

    # Billy Contact List 1 - No contacts

    # Jack Contact List 1
    addContact(cursor, 3, "Bo", "B", "b@utexas.edu")
    addContact(cursor, 3, "Jo", "J", "j@utexas.edu")

    # Jack Contact List 2
    addContact(cursor, 4, "Jill", "J", "jj@utexas.edu")

    # Hugo Contact List 1 - No contacts


"""
Adds test surveys to the SQL database

cursor (SQL alchemy cursor): the SQL alchemy cursor pointing to the SQL database
"""
def populateSurveys(cursor):
    # Kevin Contact List 1
    # Billy Contact List 1
    # Jack Contact List 1
    # Jack Contact List 2
    # Hugo Contact List 1
    pass


"""
Adds test questions to the SQL database

cursor (SQL alchemy cursor): the SQL alchemy cursor pointing to the SQL database
"""
def populateQuestions(cursor):
    pass


"""
Adds test responses to the SQL database

cursor (SQL alchemy cursor): the SQL alchemy cursor pointing to the SQL database
"""
def populateResponses(cursor):
    pass