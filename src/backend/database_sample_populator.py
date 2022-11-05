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
    testContacts(cursor)

def testContacts(cursor):
    testgetContacts(cursor)
    testupdateContactFirstName(cursor)
    testupdateContactLastName(cursor)
    testupdateContactEmailAddress(cursor)
    testdeleteContact(cursor)

def testgetContacts(cursor):
    assert getContacts(cursor, 1)[0]["first name"] == "Billy"
    assert getContacts(cursor, 1)[1]["first name"] == "Silly"
    assert getContacts(cursor, 3)[0]["first name"] == "Bo"
    assert getContacts(cursor, 3)[1]["first name"] == "Jo"
    assert getContacts(cursor, 4)[0]["first name"] == "Jill"

def testupdateContactFirstName(cursor):
    updateContactFirstName(cursor, 1, "Billy2")
    assert getContacts(cursor, 1)[0]["first name"] == "Billy2"
    updateContactFirstName(cursor, 1, "Billy")
    assert getContacts(cursor, 1)[0]["first name"] == "Billy"

def testupdateContactLastName(cursor):
    updateContactLastName(cursor, 1, "Bob2")
    assert getContacts(cursor, 1)[0]["last name"] == "Bob2"
    updateContactLastName(cursor, 1, "Bob")
    assert getContacts(cursor, 1)[0]["last name"] == "Bob"

def testupdateContactEmailAddress(cursor):
    updateContactEmailAddress(cursor, 1, "bbx2@utexas.edu")
    assert getContacts(cursor, 1)[0]["email address"] == "bbx2@utexas.edu"
    updateContactEmailAddress(cursor, 1, "bbx@utexas.edu")
    assert getContacts(cursor, 1)[0]["email address"] == "bbx@utexas.edu"

def testdeleteContact(cursor):
    assert len(getContacts(cursor, 1)) == 2
    deleteContact(cursor, 1)
    assert len(getContacts(cursor, 1)) == 1


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
    testContactLists(cursor)

def testContactLists(cursor):
    testgetContactLists(cursor)
    testupdateContactListName(cursor)
    testdeleteContactList(cursor)

def testgetContactLists(cursor):
    assert getContactLists(cursor, 1)[0]["name"] == "Kevin Contact List 1"
    assert getContactLists(cursor, 3)[0]["name"] == "Billy Contact List 1"
    assert getContactLists(cursor, 4)[0]["name"] == "Jack Contact List 1"
    assert getContactLists(cursor, 4)[1]["name"] == "Jack Contact List 2"
    assert getContactLists(cursor, 5)[0]["name"] == "Hugo Contact List 1"

def testupdateContactListName(cursor):
    updateContactListName(cursor, 2, "Billydskjfn Contact List 1")
    assert getContactLists(cursor, 3)[0]["name"] == "Billydskjfn Contact List 1"
    updateContactListName(cursor, 2, "Billy Contact List 1")
    assert getContactLists(cursor, 3)[0]["name"] == "Billy Contact List 1"

def testdeleteContactList(cursor):
    deleteContactList(cursor, 1)
    assert len(getContactLists(cursor, 1)) == 0
    assert len(getContacts(cursor, 1)) == 0


"""
Adds test surveys to the SQL database

cursor (SQL alchemy cursor): the SQL alchemy cursor pointing to the SQL database
"""
def populateSurveys(cursor):
    addSurvey(cursor, 1, 1, "survey1", 0)
    addSurvey(cursor, 2, 1, "survey2", 0)
    addSurvey(cursor, 3, 2, "survey3", 0)
    testSurveys(cursor)

def testSurveys(cursor):
    testgetSurveys(cursor)
    testaddSurvey(cursor)
    testUpdateSurveyName(cursor)

def testgetSurveys(cursor):
    assert getSurveys(cursor, 1)[0]["id"] == 1
    assert getSurveys(cursor, 1)[0]["name"] == "survey1"
    assert getSurveys(cursor, 1)[0]["count"] == 0
    assert getSurveys(cursor, 1)[0]["time"] == 0

    assert getSurveys(cursor, 2)[0]["id"] == 2
    assert getSurveys(cursor, 2)[0]["name"] == "survey2"
    assert getSurveys(cursor, 2)[0]["count"] == 0
    assert getSurveys(cursor, 2)[0]["time"] == 0

    assert getSurveys(cursor, 3)[0]["id"] == 3
    assert getSurveys(cursor, 3)[0]["name"] == "survey3"
    assert getSurveys(cursor, 3)[0]["count"] == 0
    assert getSurveys(cursor, 3)[0]["time"] == 0

def testaddSurvey(cursor):
    addSurvey(cursor, 4, 2, "survey4", 0)
    assert getSurveys(cursor, 4)[0]["id"] == 4
    assert getSurveys(cursor, 4)[0]["name"] == "survey4"
    assert getSurveys(cursor, 4)[0]["count"] == 0
    assert getSurveys(cursor, 4)[0]["time"] == 0

def testUpdateSurveyName(cursor):
    UpdateSurveyName(cursor, 4, "survey40")
    assert getSurveys(cursor, 4)[0]["name"] == "survey40"

def testpublishSurvey(cursor):
    publishSurvey(cursor, 1)
    assert getSurveys(cursor, 4)[0]["time"] == 1

# need to fix
# def testdeleteSurvey(cursor):
#     deleteSurvey(cursor, 4)
#     assert getSurveys(cursor, 4)[0]["name"] == -1



"""
Adds test questions to the SQL database

cursor (SQL alchemy cursor): the SQL alchemy cursor pointing to the SQL database
"""
def populateQuestions(cursor):
    # survey1
    addQuestion(cursor, 1, 1, "s1q1")
    addQuestion(cursor, 1, 1, "s1q2")
    addQuestion(cursor, 1, 0, "s1q3")
    # survey2
    addQuestion(cursor, 2, 1, "s2q1")
    addQuestion(cursor, 2, 0, "s2q2")
    addQuestion(cursor, 2, 1, "s2q3")
    # survey3
    addQuestion(cursor, 3, 0, "s3q1")
    addQuestion(cursor, 3, 1, "s3q2")
    addQuestion(cursor, 3, 1, "s3q3")
    testQuestions(cursor)

def testQuestions(cursor):
    testgetQuestions(cursor)
    testaddFRQ(cursor)
    testupdateFRQ(cursor)
    testdeleteFRQ(cursor)
    testaddMCQ_S(cursor)
    testaddMCQ_M(cursor)
    testupdateMCQ(cursor)
    testdeleteMCQ(cursor)

def testgetQuestions(cursor):
    assert len(getQuestions(cursor, 1)) == 3
    assert len(getQuestions(cursor, 2)) == 3
    assert len(getQuestions(cursor, 3)) == 3

    assert getQuestions(cursor, 1)[0]["prompt"] == "s1q1"
    assert getQuestions(cursor, 1)[1]["prompt"] == "s1q2"
    assert getQuestions(cursor, 1)[2]["prompt"] == "s1q3"

    assert getQuestions(cursor, 2)[0]["prompt"] == "s2q1"
    assert getQuestions(cursor, 2)[1]["prompt"] == "s2q2"
    assert getQuestions(cursor, 2)[2]["prompt"] == "s2q3"

    assert getQuestions(cursor, 3)[0]["prompt"] == "s3q1"
    assert getQuestions(cursor, 3)[1]["prompt"] == "s3q2"
    assert getQuestions(cursor, 3)[2]["prompt"] == "s3q3"

def testaddFRQ(cursor):
    addFRQ(cursor, 3) # shouldn't add frq include prompt element??
    assert len(getQuestions(cursor, 3)) == 4

def testupdateFRQ(cursor):
    updateFRQ(cursor, 10, "s3frq1")
    assert getQuestions(cursor, 3)[3]["prompt"] == "s3frq1"

def testdeleteFRQ(cursor):
    deleteFRQ(cursor, 10)
    assert len(getQuestions(cursor, 3)) == 3
    
def testaddMCQ_S(cursor):
    addMCQ_S(cursor, 3)
    assert len(getQuestions(cursor, 3)) == 4

def testaddMCQ_M(cursor):
    addMCQ_M(cursor, 3)
    assert len(getQuestions(cursor, 3)) == 5

def testupdateMCQ(cursor):
    updateMCQ(cursor, 10, "s3q4")
    updateMCQ(cursor, 11, "s3q5")
    assert getQuestions(cursor, 3)[3]["prompt"] == "s3q4"
    assert getQuestions(cursor, 3)[4]["prompt"] == "s3q5"

def testdeleteMCQ(cursor):
    deleteMCQ(cursor, 10)
    assert len(getQuestions(cursor, 3)) == 4
    deleteMCQ(cursor, 11)
    assert len(getQuestions(cursor, 3)) == 3


"""
Adds test choices to the SQL database

cursor (SQL alchemy cursor): the SQL alchemy cursor pointing to the SQL database
"""
def populateChoices(cursor):
    addChoice(cursor, 1, "yes")
    addChoice(cursor, 1, "no")
    addChoice(cursor, 1, "maybe")
    testChoices(cursor)

def testChoices(cursor):
    testgetChoices(cursor)
    testupdateChoice(cursor)
    testdeleteChoice(cursor)
    testgetQuestionsAndChoices(cursor)

def testgetChoices(cursor):
    assert len(getChoices(cursor, 1)) == 3
    assert getChoices(cursor, 1)[0]["choice"] == "yes"
    assert getChoices(cursor, 1)[1]["choice"] == "no"
    assert getChoices(cursor, 1)[2]["choice"] == "maybe"

def testupdateChoice(cursor):
    updateChoice(cursor, 1, "yes!!")
    assert getChoices(cursor, 1)[0]["choice"] == "yes!!"
    updateChoice(cursor, 1, "yes")
    assert getChoices(cursor, 1)[0]["choice"] == "yes"

def testdeleteChoice(cursor):
    deleteChoice(cursor, 1)
    assert len(getChoices(cursor, 1)) == 2

def testgetQuestionsAndChoices(cursor):
    assert getQuestionsAndChoices(cursor, 1)[0]["choices"][0]["choice"] == "no"
    assert getQuestionsAndChoices(cursor, 1)[0]["choices"][1]["choice"] == "maybe"


"""
Adds test responses to the SQL database

cursor (SQL alchemy cursor): the SQL alchemy cursor pointing to the SQL database
"""
def populateResponses(cursor):
    addQuestionResponse(cursor, 1, "Yes", 1667496258)
    addQuestionResponse(cursor, 1, "No", 1667496259)
    addQuestionResponse(cursor, 1, "Yes", 16674962510)
    addQuestionResponse(cursor, 1, "Maybe", 16674962511)
    testResponses(cursor)

def testResponses(cursor):
    testgetSurveyResults(cursor)

def testgetSurveyResults(cursor):
    assert getSurveyResults(cursor, 1)[0]["id"] == 1
    assert getSurveyResults(cursor, 1)[0]["type"] == 1
    assert getSurveyResults(cursor, 1)[0]["prompt"] == "s1q1"
    assert getSurveyResults(cursor, 1)[0]["response_list"][0]["response_id"] == 1
    assert getSurveyResults(cursor, 1)[0]["response_list"][0]["question_id"] == 1
    assert getSurveyResults(cursor, 1)[0]["response_list"][0]["reply"] == "Yes"
    assert getSurveyResults(cursor, 1)[0]["response_list"][0]["time"] == 1667496258
    assert len(getSurveyResults(cursor, 1)[0]["response_list"][0]) == 4