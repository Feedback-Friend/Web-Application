import sshtunnel
from sqlalchemy import create_engine

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
void method, does not return anything
no data is put into the database other than the schema
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
        user_id INT,
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
        PRIMARY KEY (response_id)
        );
        """)


"""
Deletes all tables in the database the SQLHandler is connected to
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


def encode(unencrypted_info):
    # encoder adds 1 to the ascii value of each character
    encoded = ""
    for char in unencrypted_info:
        encoded += chr(ord(char) + 1)
    return encoded


def decode(encrypted_info):
    decoded = ""
    for char in encrypted_info:
        decoded += chr(ord(char) - 1)
    return decoded


engine = create_engine('mysql+mysqldb://root:password@localhost:3306/feedback_friend')

eject_schema(engine)
# repopulate_schema(engine)