from sqlalchemy import create_engine
from src.backend.database_sample_populator import *
from src.backend.utility import flush_schema, getEngine
import sshtunnel
from src.backend.contacts import *
from src.backend.SQL_validation_tools import validateSQL

# connecting to oracle cloud compute unit for database
tunnel = sshtunnel.SSHTunnelForwarder(
    ('150.136.92.200', 22), 
    ssh_username='opc', 
    ssh_pkey="ssh-key-2022-09-13.key",
    remote_bind_address=('localhost', 3306)
)

tunnel.start()

engine = getEngine()  # default: CLOUD engine
validateSQL(engine)