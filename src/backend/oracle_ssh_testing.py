from flask import Flask 
from sqlalchemy import create_engine
import sshtunnel 

app = Flask(__name__)

tunnel = sshtunnel.SSHTunnelForwarder(
    ('150.136.92.200', 22), 
    ssh_username='opc', 
    ssh_pkey="~/ssh-key-2022-09-13.key",
    remote_bind_address=('localhost', 3306)
)

tunnel.start()

engine = create_engine('mysql+mysqldb://test:rY!&pa4PsDAq@127.0.0.1:%s/db' % tunnel.local_bind_port)

@app.route('/')
def index():
    return 'Index Page --> ' + str(engine.table_names())
