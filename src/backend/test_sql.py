from sqlalchemy import create_engine
from database_sample_populator import *
from utility import flush_schema

engine = create_engine('mysql+mysqldb://root:password@localhost:3306/feedback_friend')  # establish connection to database
cursor = engine.connect()

flush_schema(engine)
populateTestUsers(cursor)
populateContactLists(cursor)
populateContacts(cursor)
pass
