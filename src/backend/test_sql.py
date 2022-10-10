import sshtunnel
from sqlalchemy import create_engine
from user import *
from utility import *

engine = create_engine('mysql+mysqldb://root:password@localhost:3306/feedback_friend')  # establish connection to database
cursor = engine.connect()

addTestUsers(cursor)
# flush_schema(engine)