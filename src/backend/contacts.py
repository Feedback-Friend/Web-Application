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


"""
Adds a contact list to the database. The contact list will be registered under a specific user through userID, and have a name which is contactListName
"""
def addContactList(cursor, userID, contactListName):
    contact_lists = cursor.execute("SELECT * FROM contact_lists WHERE contact_list_name=%s", contactListName)

    for contact_list in contact_lists:  # there should be no duplicates
        return {'result': '-1'}

    cursor.execute("INSERT INTO contact_lists (user_id, contact_list_name) VALUES (%s, %s)", (int(userID), contactListName))

    ids = cursor.execute("SELECT contact_list_id FROM contact_lists WHERE contact_list_name=%s", contactListName)
    for id in ids:
        return {'result': id[0]}

    return {'result': '-1'}  # should not happen

def updateContactListName(cursor, contactListID, contactListName):
    cursor.execute("UPDATE contact_lists SET contact_list_name = %s WHERE contact_list_id = %s", (contactListName, int(contactListID)))

"""
Given a contact list id, deletes all contacts in that contact list and the list itself

this action will remove all contacts associated with the contact list and the contact list itself
in addition, any survey that was previously linked to the contact list being deleted will be linked to a null contact list (-1)
"""
def deleteContactList(cursor, contactListID):
    # all of the surveys that point to this contact list need to be set to reference contact list -1 now
    cursor.execute("UPDATE surveys SET contact_list_id = -1 WHERE contact_list_id = %s", (int(contactListID)))

    # delete all contacts in the contact list
    cursor.execute("DELETE FROM contacts WHERE contact_list_id = %s", (int(contactListID)))

    # delete the contact list itself
    cursor.execute("DELETE FROM contact_lists WHERE contact_list_id = %s", (int(contactListID)))

def getContacts(cursor, contactListID):
    table = cursor.execute("SELECT * FROM contacts WHERE contact_list_id=%s", (str(contactListID)))
    contacts = []
    for entry in table:
        contacts.append({"first name": entry[2], "last name": entry[3], "email address": entry[4]})
    return contacts

def addContact(cursor, contactListID, firstName, lastName, emailAddress):
    table = cursor.execute("SELECT * FROM contacts WHERE contact_list_id=%s", (int(contactListID)))
    for entry in table:
        if entry[4] == emailAddress:
            return jsonify({'result': '-1'})  # duplicate email address not allowed
    cursor.execute("INSERT INTO contacts (contact_list_id, first_name, last_name, email_address) VALUES(%s, %s, %s, %s)", (int(contactListID), firstName, lastName, emailAddress))

    contact_ids = cursor.execute("SELECT contact_id FROM contacts WHERE email_address=%s", emailAddress)
    for id in contact_ids:
        return {'result': id[0]}

    return {'result': "error"}

"""
Updates the first name of a contact using the contact id provided
"""
def updateContactFirstName(cursor, contactID, firstName):
    cursor.execute("UPDATE contacts SET first_name = %s WHERE contact_id = %s", (firstName, int(contactID)))

"""
Updates the last name of a contact using the contact id provided
"""
def updateContactLastName(cursor, contactID, lastName):
    cursor.execute("UPDATE contacts SET last_name = %s WHERE contact_id = %s", (lastName, int(contactID)))

"""
Updates the email address of a contact using the contact id provided
"""
def updateContactEmailAddress(cursor, contactID, emailAddress):
    cursor.execute("UPDATE contacts SET email_address = %s WHERE contact_id = %s", (emailAddress, int(contactID)))


"""
deletes a contact from a contact list of the specified id
"""
def deleteContact(cursor, contactListID, contactID):
    cursor.execute("DELETE FROM contacts WHERE contact_id = %s", (int(contactID)))

"""
Given a user ID belonging to a user, return all the contact list information associated with the user.
Each contact list entry will have contact information nested inside in a single JSON response
"""
def getContactInfoDataStructure(cursor, userID):
    contactListsTable = cursor.execute("SELECT * FROM contact_lists WHERE user_id=%s", (str(userID)))
    contactLists = []
    for contactList in contactListsTable:
        contacts_ary = []
        contacts = cursor.execute("SELECT * FROM contacts WHERE contact_list_id=%s",(str(contactList[0])))
        for contact in contacts:
            contacts_ary.append({"id": contact[0], "first_name": contact[2], "last_name": contact[3], "email": contact[4]}) #return contact id, first name, last name, email address
        contactLists.append({'contact_list_id': contactList[0], 'user_id': contactList[1], 'contact_list_name': contactList[2], 'contacts': contacts_ary})
    return contactLists
