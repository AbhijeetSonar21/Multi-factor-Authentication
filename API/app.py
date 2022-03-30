from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
# from flaskext.mysql import MySQL
import pymysql

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'm_auths'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'mauth'

mysql = MySQL(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/users', methods=['GET', 'POST'])
def index():
    if request.method == "GET":
        conn = mysql.connection
        cursor =conn.cursor()
        cursor.execute("SELECT * from Users")
        data = cursor.fetchall()
        return jsonify(data)

@app.route('/auth_1', methods=['GET', 'POST']) # user login
def auth_1():
    if request.method == "GET":
        conn = mysql.connection
        cursor =conn.cursor()
        UserName = "absonar"
        Password = "password_1"
        query = "SELECT * from Users where UserName = %s"
        cursor.execute(query,[UserName])
        data = cursor.fetchone()
        db_password = data[3]
        if (Password == db_password):
            return "Authenticated"
        else :
            return "Incorrect User_id or Password"



if __name__ == '__main__':
    app.debug =True
    app.run()