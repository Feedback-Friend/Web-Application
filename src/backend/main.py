from flask import Flask

# the build files for react go in the specified static folder, which allows flask to access react's frontend
app = Flask(__name__, static_folder='../../build/', static_url_path='/')

@app.route('/')
@app.route('/register')
def root():
    return app.send_static_file('index.html')
