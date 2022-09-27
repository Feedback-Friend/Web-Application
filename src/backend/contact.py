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
    return jsonify(contactLists)

def addContactList(cursor, userID, contactListName):
    table = cursor.execute("SELECT * FROM contact_lists")
    contactListID = 0
    for entry in table:
        if entry[3] == contactListName:
            return jsonify({'result': '-1'})
        contactListID = entry[0]+1
    cursor.execute("INSERT INTO contact_lists VALUES(%s, %s, %s, %s)", (int(contactListID), int(userID), contactListName))
    return jsonify({'result': contactListID})

def updateContactListName(cursor, contactListID, contactListName):
    cursor.execute("UPDATE contact_lists SET contact_list_name = '%s' WHERE contact_list_id = %s", (contactListName, int(contactListID)))

def deleteContactList(cursor, contactListID):
    cursor.execute("DELETE FROM contacts WHERE contact_list_id = %s", (int(contactListID)))
    cursor.execute("DELETE FROM contact_lists WHERE contact_list_id = %s", (int(contactListID)))

def getContacts(cursor, contactListID):
    table = cursor.execute("SELECT * FROM contacts WHERE contact_list_id=%s", (str(contactListID)))
    contacts = []
    for entry in table:
        contacts.append({"first name": entry[2], "last name": entry[3], "email address": entry[4]})
    return jsonify(contacts)

def addContact(cursor, contactListID, firstName, lastName, emailAddress):
    table = cursor.execute("SELECT * FROM surveys WHERE contact_list_id=%s"(int(contactListID)))
    contactID = 0
    for entry in table:
        if entry[4] == emailAddress:
            return jsonify({'result': '-1'})
        contactID = entry[0]+1
    cursor.execute("INSERT INTO contact_lists VALUES(%s, %s, %s, %s)", (int(contactID), int(contactID), firstName, lastName, emailAddress))
    return jsonify({'result': contactID})

def updateContactFirstName(cursor, contactID, contactFirstName):
    cursor.execute("UPDATE contact_lists SET first_name = '%s' WHERE contact_id = %s", (contactFirstName, int(contactID)))

def updateContactLastName(cursor, contactID, contactLastName):
    cursor.execute("UPDATE contact_lists SET lasst_name = '%s' WHERE contact_id = %s", (contactLastName, int(contactID)))

def updateContactEmailAddress(cursor, contactID, contactEmailAddress):
    cursor.execute("UPDATE contact_lists SET email_address = '%s' WHERE contact_id = %s", (contactEmailAddress, int(contactID)))

def deleteContact(cursor, contactID):
    cursor.execute("DELETE FROM contacts WHERE contact_id = %s", (int(contactID)))