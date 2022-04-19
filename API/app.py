from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
# from flaskext.mysql import MySQL
import pymysql
from flask_cors import CORS
from binascii import a2b_base64
# import urllib.parse
from datauri import DataURI
import uuid

import smtplib
import random
from Crypto.Cipher import DES

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


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

@app.route('/auth_3', methods=['GET', 'POST']) # image capture
def auth_3():
    if request.method == "POST":
        image_data = request.json
        uri = DataURI(image_data["image_data"])
        fd = open('images/image.png', 'wb')
        fd.write(uri.data)
        fd.close()
        return {"status": "otp sent","otp" : "otp"}



@app.route('/auth_2', methods=['GET', 'POST']) # resend otp
def auth_2():
    if request.method == "POST":
        user_data = request.json
        email = user_data['email']
        print("=================",email)
        otp = random.randint(10000000, 99999999)
        status = sendotp(email,otp)
        return {"status": "otp sent","otp" : otp}


@app.route('/auth_1', methods=['GET', 'POST']) # user login
def auth_1():
    if request.method == "POST":
        # header = request.headers
        # header['Access-Control-Allow-Origin'] = '*'

        user_data = request.json
        print("=================",user_data)
        conn = mysql.connection
        cursor =conn.cursor()
        UserName = user_data['UserName']
        Password = user_data['Password']
        query = "SELECT * from Users where UserName = %s"
        cursor.execute(query,[UserName])
        data = cursor.fetchone()
        if (data):
            print(data)
            db_password = data[3]
            email = data[5]
            if (user_data['Password'] == db_password):

                # OTP GENERATOR AND EMAIL SENDER
                otp = random.randint(10000000, 99999999)
                status = sendotp(email, otp)

                return {"status": "success","otp":otp,"email":email}
            else :
                return {"status": "failed","Error": "Incorrect User_id or Password"}
        else :
            return {"status": "failed","Error": "Incorrect User_id or Password"}

def sendotp(email,otp):
    s = smtplib.SMTP("smtp.gmail.com" , 587)  
    s.starttls()
    subject = "OTP Testing"

    s.login("noreply.multiauth@gmail.com" , "Password@1A")
    otp = str(otp)

    message = 'Subject: {}\n\n{}'.format(subject, otp)
    
    s.sendmail("noreply.multiauth@gmail.com", email, message)
    print("OTP sent succesfully..")
    s.quit()
    return 1


@app.route('/newdata', methods=['GET', 'POST'])
def new():
        if request.method == "POST":
            user_data = request.json
            # print(user_data)
            sql_id = uuid.uuid1()
            form_user_name = user_data['username']
            form_name = user_data['name']
            form_password = user_data['password']
    
            # print(user_data['image'])
            # uri = DataURI(user_data['image'])
            # print("\n ",uri.mimetype)
    
            form_image_path = "../Database/ExistingUser/Random.png"
            form_email = user_data['email']
            # print(form_email,form_image_path,form_name,form_password,form_user_name)
    
            conn = mysql.connection
            cursor = conn.cursor()
            query = "INSERT INTO Users values(%s,%s,%s,%s,%s,%s)"
    

            # key = b'secret'
            # des = DES.new(key, DES.MODE_ECB)
            # print(des.decrypt(form_email))
            cursor.execute(query, [sql_id, form_user_name, form_name, form_password, form_image_path, form_email])
            # cursor.execute("SELECT * from Users")
            # data = cursor.fetchall()
            mysql.connection.commit()
            # print(data)
            return {"status":"status"}

if __name__ == '__main__':
    app.debug =True
    app.run(port=5100)