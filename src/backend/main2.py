import sys
import os
from flask import Flask
app = Flask(__name__)

os.chdir('/var/www/html/WebApplication/')

@app.route('/')
def get_path():
    return str(os.getcwdb())