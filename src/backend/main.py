from flask import Flask
import mysql.connector as mysql

# the build files for react go in the specified static folder, which allows flask to access react's frontend
app = Flask(__name__, static_folder='../../build/', static_url_path='/')

@app.route('/')
@app.route('/register')
def root():
    return app.send_static_file('index.html')

def registerUser(firstName, lastName, userName, passWord, emailAddress):
    db = mysql.connect(user="root", password="phu3Tuwe10.Diez", host="localhost", database="test", auth_plugin="mysql_native_password")
    cursor = db.cursor()
    cursor.execute("INSERT INTO users VALUES("+str(user)+", ""+first+"", ""+last+"", ""+login+"", ""+password+"", ""+email+"")")
