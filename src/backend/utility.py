import sshtunnel
from sqlalchemy import create_engine
from src.backend.users import *

# tunnel = sshtunnel.SSHTunnelForwarder(
#     ('150.136.92.200', 22), 
#     ssh_username='opc', 
#     ssh_pkey="ssh-key-2022-09-13.key",
#     remote_bind_address=('localhost', 3306)
# )

# tunnel.start()

# engine = create_engine('mysql+mysqldb://test:rY!&pa4PsDAq@127.0.0.1:%s/db' % tunnel.local_bind_port)

"""
Repopulates an empty database with the SQL schema.
No data is put into the database other than the schema

engine (SQL alchemy engine): the SQL alchemy engine pointing to the SQL database
void method, does not return anything
"""
def repopulate_schema(engine):
    cursor = engine.connect()
    result = engine.execute("SHOW TABLES;")
    tables = result.fetchall()
    if len(tables) != 0:
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
        status INT,
        time BIGINT,
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


"""
Deletes all tables in the database the SQLHandler is connected to

engine (SQL alchemy engine): the SQL alchemy engine pointing to the SQL database
void method, does not return anything
"""
def eject_schema(engine):
    cursor = engine.connect()
    result = cursor.execute("SHOW TABLES;")
    tables = result.fetchall()
    tables = [table[0] for table in tables]
    for table in tables:
        cursor.execute(f"DROP TABLE {table};")
    print("all tables successfully removed")


"""
Resets the database to a blank slate schema using a combination of the schema deletion and schema creation. Void method, does not return anything

engine (SQL alchemy engine): the SQL alchemy engine pointing to the SQL database
"""
def flush_schema(engine):
    eject_schema(engine)
    repopulate_schema(engine)


"""
This method returns an encoded string after adding 1 to all of the character
ascii values of the input string. This encryption function is intended to demonstrate a proof of concept of encryption.

unencrypted_info (String): the input string
returns (String): the encrypted string
"""
def encode(unencrypted_info):
    # encoder adds 1 to the ascii value of each character
    encoded = ""
    for char in unencrypted_info:
        encoded += chr(ord(char) + 1)
    return encoded


"""
This method returns an decoded string after removing 1 from all of the character
ascii values of the input encoded string. This decoding function is intended to demonstrate a proof of concept of decryption and should be paired with the encode method.

encrypted_info (String): the encrypted input string
returns (String): the decoded string
"""
def decode(encrypted_info):
    decoded = ""
    for char in encrypted_info:
        decoded += chr(ord(char) - 1)
    return decoded


"""
This method evaluates password strength
password strength is evaluated on the length of the password and if it
contains special characters or not

password (String): the password whose strength needs to be checked
length (int): the length of a password of sufficient length

returns (int):
0 -> password is not long enough and does not contain a special character
1 -> exactly one of (password is long enough, password contains a special character)
2 -> password is long enough and password contains a special character
"""
def passwordStrength(password, length):
    strength = 0  # the strength to be returned
    specials = set("!@#$%")

    if (len(password) >= length):
        strength += 1  # length check

    for char in password:
        if char in specials:
            strength += 1  # special character check
            break

    return strength