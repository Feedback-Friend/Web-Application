import sshtunnel
from sqlalchemy import create_engine
from userTest import *

engine = create_engine('mysql+mysqldb://root:password@localhost:3306/feedback_friend')  # establish connection to database
cursor = engine.connect()

#print(registerUser(cursor, "Kevin", "Li", "kevinli22527", "kli1", "kevinli22527@yahoo.com"))
#print(loginUser(cursor, "kevinli22527", "kli1"))
#print(getFirstName(cursor, 3))
print(deleteUser(cursor, 2))
# print("done")

# print(getFirstName(cursor, 1))