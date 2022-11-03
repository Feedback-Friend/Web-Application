from flask import Flask
from flask.json import jsonify
import mysql.connector as mysql
from SQLConnector import SQLConnector

"""
The SQLHandler class abstracts out functionality for calling CRUD operations on the database.
It handles the login to the database from an input SQL connector, and then proceeds to provide
functionality for all essential database functions.

Parameters-------------
credentials: a SQLConnector object to login with
"""
class SQLHandler:

    """
    Class constructor, initializes the appropriate SQL connection given credentials
    """
    def __init__(self, credentials):
        self.credentials = credentials
        self.MODE = credentials.mode

        if (self.MODE == "LOCAL"):
            #local connection
            self.db_connection = mysql.connect(
                user=credentials.user,
                password=credentials.password,
                host=credentials.host,
                database=credentials.database,
                auth_plugin="mysql_native_password"
            )
            print("Connection successful")
        else:
            #cloud connection
            # want to establish a connection to oracle MySQL database using ssh tunnel
            #TODO
            self.db_connection = None


    """
    Deletes all tables in the database the SQLHandler is connected to
    void method, does not return anything
    """
    def eject_tables(self):
        cursor = self.db_connection.cursor()
        cursor.execute("SHOW TABLES;")
        tables = cursor.fetchall()
        tables = [table[0] for table in tables]
        for table in tables:
            cursor.execute(f"DROP TABLE {table}")
        print("all tables successfully removed")

    """
    Repopulates an empty database with the SQL schema.
    void method, does not return anything
    no data is put into the database other than the schema
    """
    def repopulate_schema(self):
        cursor = self.db_connection.cursor()
        cursor.execute("SHOW TABLES;")
        results = cursor.fetchall()
        if len(results) != 0:
            raise Exception("The database is not empty")
        else:
            # PROCEED WITH SCHEMA CREATION

            # create users table
            cursor.execute("""
                CREATE TABLE users (
                user_id INT NOT NULL AUTO_INCREMENT,
                first_name VARCHAR(30),
                last_name VARCHAR(20),
                user_name VARCHAR(30),
                pass_word VARCHAR(30),
                email_address VARCHAR(50),
                PRIMARY KEY (user_id)
                );
                """)

            # create contact lists table
            cursor.execute("""
            CREATE TABLE contact_lists (
            contact_list_id INT NOT NULL AUTO_INCREMENT,
            user_id INT,
            contact_list_name VARCHAR(50),
            PRIMARY KEY(contact_list_id)
            );
            """)

            # create contacts table
            cursor.execute("""
            CREATE TABLE contacts (
            contact_id INT NOT NULL AUTO_INCREMENT,
            contact_list_id INT,
            first_name VARCHAR(30),
            last_name VARCHAR(20),
            email_address VARCHAR(50),
            PRIMARY KEY (contact_id)
            );
            """)

            # create surveys table
            cursor.execute("""
            CREATE TABLE surveys (
            survey_id INT NOT NULL AUTO_INCREMENT,
            user_id INT,
            contact_list_id INT,
            survey_name VARCHAR(50),
            PRIMARY KEY (survey_id)
            );
            """)
            # create questions table
            cursor.execute("""
            CREATE TABLE questions(
            question_id INT NOT NULL AUTO_INCREMENT,
            survey_id INT,
            quesion_type INT,
            prompt VARCHAR(500),
            PRIMARY KEY (question_id)
            );
            """)

            # create choices table
            cursor.execute("""
            CREATE TABLE choices(
            choice_id INT NOT NULL AUTO_INCREMENT,
            question_id INT,
            choice VARCHAR(500),
            PRIMARY KEY (choice_id)
            );
            """)

            # create responses table
            cursor.execute("""
            CREATE TABLE responses(
            response_id INT NOT NULL AUTO_INCREMENT,
            question_id INT,
            reply VARCHAR(500),
            time BIGINT,
            PRIMARY KEY (response_id)
            );
            """)



credentials = SQLConnector("localhost", "feedback_friend", "root", "password", "LOCAL")
handler = SQLHandler(credentials)
handler.eject_tables()