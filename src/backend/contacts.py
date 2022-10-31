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


"""
Adds a contact list to the database. The contact list will be registered under a specific user through userID, and have a name which is contactListName
"""
def addContactList(cursor, userID, contactListName):
    contact_lists = cursor.execute("SELECT * FROM contact_lists WHERE contact_list_name=%s", contactListName)

    for contact_list in contact_lists:  # there should be no duplicates
        return jsonify({'result': '-1'})

    cursor.execute("INSERT INTO contact_lists (user_id, contact_list_name) VALUES (%s, %s)", (int(userID), contactListName))

    # get the contact list ID that was just added
    id = cursor.execute("SELECT contact_list_id FROM contact_lists WHERE contact_list_name=%s", contactListName)

    for id_entry in id:
        return jsonify({'result': id_entry[0]})

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
    return jsonify(contacts)

def addContact(cursor, contactListID, firstName, lastName, emailAddress):
    table = cursor.execute("SELECT * FROM contacts WHERE contact_list_id=%s", (int(contactListID)))
    for entry in table:
        if entry[4] == emailAddress:
            return jsonify({'result': '-1'})
    cursor.execute("INSERT INTO contacts (contact_list_id, first_name, last_name, email_address) VALUES(%s, %s, %s, %s)", (int(contactListID), firstName, lastName, emailAddress))
    return jsonify({'result': "success"})

def updateContactFirstName(cursor, contactID, firstName):
    cursor.execute("UPDATE contacts SET first_name = %s WHERE contact_id = %s", (firstName, int(contactID)))

def updateContactLastName(cursor, contactID, lastName):
    cursor.execute("UPDATE contacts SET last_name = %s WHERE contact_id = %s", (lastName, int(contactID)))

def updateContactEmailAddress(cursor, contactID, emailAddress):
    cursor.execute("UPDATE contacts SET email_address = %s WHERE contact_id = %s", (emailAddress, int(contactID)))

def deleteContact(cursor, contactID):
    cursor.execute("DELETE FROM contacts WHERE contact_id = %s", (int(contactID)))

"""
Given a user ID belonging to a user, return all the contact list information associated with the user.
Each contact list entry will have contact information nested inside in a single JSON response
"""
def getContactListsAndContacts(cursor, userID):
    contactListsTable = cursor.execute("SELECT * FROM contact_lists WHERE user_id=%s", (str(userID)))
    contactLists = []
    for contactList in contactListsTable:
        contacts_ary = []
        contacts = cursor.execute("SELECT * FROM contacts WHERE contact_list_id=%s",(str(contactList[0])))
        for contact in contacts:
            contacts_ary.append({"id": contact[0], "first_name": contact[2], "last_name": contact[3], "email": contact[4]}) #return contact id, first name, last name, email address
        contactLists.append({'contact_list_id': contactList[0], 'user_id': contactList[1], 'contact_list_name': contactList[2], 'contacts': contacts_ary})
    return jsonify(contactLists)
