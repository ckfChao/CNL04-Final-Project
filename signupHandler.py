from flask_restful import Api, Resource, reqparse, request
from flask import redirect, flash, make_response
import psycopg2
import datetime

  
class signupHandler(Resource):
    # def __init__(self, session, db_conn):
        # self.session = session
        # self.conn = db_conn  
  
    def get(self):
        return {
          'resultStatus': 'FAILURE',
          'message': "Wrong method"
          }, 400

    def post(self):
        conn = psycopg2.connect('postgres://dmrakrvfzancyh:a49bc74ae56e0cc09276c48bbf575320e4d2ef803e7cf2c9923d61c9d7409dbb@ec2-44-194-117-205.compute-1.amazonaws.com:5432/dbmji6v13v7oqt')
        cur = conn.cursor()


        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('password', type=str)
        parser.add_argument('identity', type=str)
        
        args = parser.parse_args()
        
        request_username = args['username']
        request_password = args['password']
        request_identity = args['identity']
        
        print(args['username'])
        print(args['password'])
        print(args['identity'])

        print(args)

        
        if request_identity == 'store':
            cur.execute("SELECT username FROM store WHERE username = '" + request_username + "';")
            find = cur.fetchall()
            if not find:
                now_time = datetime.datetime.now().strftime("%Y-%m-%d  %H:%M:%S")    
                cur.execute("INSERT INTO store (username, password, created_on) VALUES (%s, %s, %s);", (request_username, request_password, now_time))
                conn.commit()
                cur.close()
                return {"resultStatus": "SUCCESS", "message": "Signup successfully"}, 200
            else:
                return {"resultStatus": "FAILURE", "message": "Username exist"}, 400
        
        elif request_identity == 'customer':
            cur.execute("SELECT username FROM customer WHERE username = '" + request_username + "';")
            find = cur.fetchall()
            if not find:
                now_time = datetime.datetime.now().strftime("%Y-%m-%d  %H:%M:%S")  
                cur.execute("INSERT INTO customer (username, password, created_on) VALUES (%s, %s, %s);", (request_username, request_password, now_time))
                conn.commit()
                cur.close()
                return {"resultStatus": "SUCCESS", "message": "Signup successfully"}, 200
            else:
                return {"resultStatus": "FAILURE", "message": "Username exist"}, 400
        else:
            return {"resultStatus": "FAILURE", "message": "Wrong identity(not store neither customer)"}, 400
        