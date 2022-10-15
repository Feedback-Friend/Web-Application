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