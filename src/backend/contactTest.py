from flask import Flask
from flask.json import jsonify

def getContactLists(cursor, userID):
    table = cursor.execute("SELECT * FROM contact_lists WHERE user_id=%s", (str(userID)))
    contactLists = []
    for entry in table:
        count = 0
        contacts = cursor.execute("SELECT * FROM contact_lists WHERE contact_list_id=%s", (str(entry[0])))
        for contact in contacts:
            count = count + 1
        contactLists.append({"id": entry[0], "name": entry[2], "count": count}) #return contact id, name, and contacts
    return contactLists

def addContactList(cursor, userID, contactListName):
    table = cursor.execute("SELECT * FROM contact_lists")
    for entry in table:
        if entry[2] == contactListName:
            return "Already Exists"
    cursor.execute("INSERT INTO contact_lists (user_id, contact_list_name) VALUES(%s, %s)", (int(userID), contactListName))
    return "Success"

def updateContactListName(cursor, contactListID, contactListName):
    cursor.execute("UPDATE contact_lists SET contact_list_name = %s WHERE contact_list_id = %s", (contactListName, int(contactListID)))

def deleteContactList(cursor, contactListID):
    cursor.execute("DELETE FROM contacts WHERE contact_list_id = %s", (int(contactListID)))
    cursor.execute("DELETE FROM contact_lists WHERE contact_list_id = %s", (int(contactListID)))

def getContacts(cursor, contactListID):
    table = cursor.execute("SELECT * FROM contacts WHERE contact_list_id=%s", (str(contactListID)))
    contacts = []
    for entry in table:
        contacts.append({"first name": entry[2], "last name": entry[3], "email address": entry[4]})
    return contacts

def addContact(cursor, contactListID, firstName, lastName, emailAddress):
    table = cursor.execute("SELECT * FROM contacts WHERE contact_list_id=%s", int(contactListID))
    for entry in table:
        if entry[4] == emailAddress:
            return "Already Exists"
    cursor.execute("INSERT INTO contacts (contact_list_id, first_name, last_name, email_address) VALUES(%s, %s, %s, %s)", (int(contactListID), firstName, lastName, emailAddress))
    return "Success"

def updateContactFirstName(cursor, contactID, firstName):
    cursor.execute("UPDATE contacts SET first_name = %s WHERE contact_id = %s", (firstName, int(contactID)))

def updateContactLastName(cursor, contactID, lastName):
    cursor.execute("UPDATE contacts SET last_name = %s WHERE contact_id = %s", (lastName, int(contactID)))

def updateContactEmailAddress(cursor, contactID, emailAddress):
    cursor.execute("UPDATE contacts SET email_address = %s WHERE contact_id = %s", (emailAddress, int(contactID)))

def deleteContact(cursor, contactID):
    cursor.execute("DELETE FROM contacts WHERE contact_id = %s", (int(contactID)))