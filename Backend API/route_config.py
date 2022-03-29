from flask import Flask


app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello!!'

@app.before_request
def prior_req():
    print('Before')

@app.route('/api/credentials',methods=['POST'])
def pass_credentials():
    print('Passing creds')