from sqlalchemy import create_engine
from src.backend.database_sample_populator import *
from src.backend.utility import flush_schema
import sshtunnel
from src.backend.contacts import *

# connecting to oracle cloud compute unit for database
tunnel = sshtunnel.SSHTunnelForwarder(
    ('150.136.92.200', 22), 
    ssh_username='opc', 
    ssh_pkey="ssh-key-2022-09-13.key",
    remote_bind_address=('localhost', 3306)
)

tunnel.start()

engine = create_engine('mysql+mysqldb://test:rY!&pa4PsDAq@127.0.0.1:%s/db' % tunnel.local_bind_port)

# engine = create_engine('mysql+mysqldb://root:password@localhost:3306/feedback_friend')  # establish connection to database
cursor = engine.connect()

flush_schema(engine)
populateTestUsers(cursor)
populateContactLists(cursor)
populateContacts(cursor)

addContactList(cursor, 1, "New CL1")
print("Success")
