
# Import smtplib for our actual email sending function
import smtplib
 
from src.backend.utility import getEngine


"""
Sends an email to the user asking them to take the survey. The survey ID and contact list ID will be linked to the email
to ensure that responses are anonymous and linked to the correct survey and contact list
"""
def sendEmail(cursor, surveyID, contactListID):
    try:
        userEmail = 'OracleFeedbackFriend@gmail.com'
        userPassword = 'adnjniujniczjoye'

        surveyName = ""
        surveyLink = ("[IP]/#/survey/%s", surveyID)
        userFirst = ""
        userLast = ""
        table = cursor.execute("SELECT * FROM surveys WHERE survey_id=%s", (str(surveyID)))
        for entry in table:
            surveyName=entry[3]
            user = cursor.execute("SELECT * FROM users WHERE user_id=%s", (str(entry[0])))
            for row in user:
                userFirst = row[1]
                userLast = row[2]


        table = cursor.execute("SELECT * FROM contacts WHERE contact_list_id=%s", (str(contactListID)))
        for entry in table:
            contactFirst = entry[2]
            contactLast = entry[3]
            contactEmail = entry[4]
            with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
                smtp.ehlo()
                smtp.starttls()
                smtp.ehlo()
        
                smtp.login(userEmail, userPassword)
        
                subject = ('Feedback Friend Survey: %s',surveyName)
                body = ('Hi '+contactFirst+' '+contactLast+', would you please take our survey?\n'+surveyLink+'\n\nThank you,\n'+userFirst+' '+userLast)
        
                msg = f'Subject: {subject}\n\n{body}'
        
                smtp.sendmail(userEmail, contactEmail, msg)

        return {'message': 'success'}
    except:
        return {'message': 'failure'}

def catchupContact(cursor, userID, contactListID, contactFirst, contactLast, contactEmail):
    
    userEmail = 'OracleFeedbackFriend@gmail.com'
    userPassword = 'adnjniujniczjoye'
    
    userFirst = ""
    userLast = ""
    user = cursor.execute("SELECT * FROM users WHERE user_id=%s", (str(userID)))
    for row in user:
        userFirst = row[1]
        userLast = row[2]

    table = cursor.execute("SELECT * FROM surveys WHERE user_id=%s AND contact_list_id=%s", (str(userID), str(contactListID)))
    for entry in table:
        surveyName = entry[2]
        surveyLink = ("[IP]/#/survey/%s", entry[1])
        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
    
            smtp.login(userEmail, userPassword)
    
            subject = ('Feedback Friend Survey: %s',surveyName)
            body = ('Hi %s, would you please take our survey?\n%s\n\nThank you,\n%s', contactFirst+' '+contactLast, surveyLink, userFirst+' '+userLast)
    
            msg = f'Subject: {subject}\n\n{body}'
    
            smtp.sendmail(userEmail, contactEmail, msg)


engine = getEngine(connection_type='cloud')
cursor = engine.connect()
sendEmail(cursor, 1, 3)