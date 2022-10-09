from flask import Flask
from flask.json import jsonify
import mysql.connector as mysql


"""
The SQLConnector class is meant to abstract SQL connection and login functionality. Ideally, a developer would instantiate the SQLConnector class with all the necessary login credentials and pass it as an input into the SQL Handler class to establish the connection to the SQL server. The SQLConnector class will be able to operate in two modes. 

LOCAL MODE: credentials supplied to the SQLConnector class will establish a connection to a local MySQL database

CLOUD MODE: credentials supplied to the SQLConnector class will establish a connection to a cloud MySQL database, in this case an OCI MySQL database

Parameters--------
host: name of the host to connect to
database: name of the SQL database to connect to. e.g. "Feedback_Friend"
user: user that is accessing the database
password: password for the user
mode: can be "LOCAL" or "CLOUD". If "LOCAL", represents a connection payload to a local database. If "CLOUD", represents a connection payload to a cloud database
"""
class SQLConnector:
    def __init__(self, host, database, user="root", password="password", mode="LOCAL"):
        self.host = host
        self.database = database
        self.user = user
        self.password = password
        self.mode = mode
