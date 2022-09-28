
# Import smtplib for our actual email sending function
import smtplib
 
# Helper email modules 
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

def sendEmail(cursor, surveyID, contactListID):
    # sender email address
    email_user = 'OracleFeedbackFriend'+'@'+'gmail.com'
    
    # sender email passowrd for login purposes
    email_password = 'c5b@bS3jrcq-TG7e'

    surveyName = ""
    table = cursor.execute("SELECT * FROM surveys WHERE survey_id=%s", (str(contactListID)))
    for entry in table:
        surveyName=entry[3]

    table = cursor.execute("SELECT * FROM contacts WHERE contact_list_id=%s", (str(contactListID)))
    for entry in table:
        # list of users to whom email is to be sent
        email_send = ['%s',(entry[4])]
        subject = ('Feedback Friend Survey: %s',(surveyName))
        msg = MIMEMultipart()
        msg['From'] = email_user

        # converting list of recipients into comma separated string
        msg['To'] = ", ".join(email_send)
        msg['Subject'] = subject
        body = ('Hi %s %s, would you please take our survey?',(entry[2],entry[3]))
        msg.attach(MIMEText(body,'plain'))
        text = msg.as_string()

        server = smtplib.SMTP('smtp.gmail.com',587)
        server.starttls()
        server.login(email_user,email_password)
        server.sendmail(email_user,email_send,text)
        server.quit()