import smtplib
from email.message import EmailMessage

EMAIL_ADDRESS = 'OracleFeedbackFriend@gmail.com'
EMAIL_PASSWORD = 'adnjniujniczjoye'

msg = EmailMessage()
msg['Subject'] = 'SMTP Protocol Python Test'
msg['From'] = EMAIL_ADDRESS
msg['To'] = 'kevinli22527@yahoo.com'
msg.set_content('haha, hopefully this works') #content shown if the email does not allow HTML
msg.add_alternative("""\
<!DOCTYPE html>
<html>
    <body>
        <h1 style="color:HotPink;"> This is an HTML Email automatically generated through gmail SMTP, it's hot pink</h1>
        <br>
        <h1 style="color:Blue;"> Blue colored text</h1>
        <br>
        <h1 style="color:Red;"> Red colored text </h1>
        <br>
        <h1 style="color:Orange;"> This might be a good senior design Risk Reduction activity completed </h1>
        <br>
    </body>
</html>
""", subtype='html')  #content shown if the email allows HTML

with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
    smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    smtp.send_message(msg)
