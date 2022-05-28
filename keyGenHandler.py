from flask_restful import Api, Resource, reqparse
from hashlib import sha512
import random
import psycopg2
import time

class keyGenHandler(Resource):
    def __init__(self, session, conn):
        self.session = session
        self.conn = conn

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type = str)
        parser.add_argument('password', type = str)
        args = parser.parse_args()

        conn = psycopg2.connect('postgres://dmrakrvfzancyh:a49bc74ae56e0cc09276c48bbf575320e4d2ef803e7cf2c9923d61c9d7409dbb@ec2-44-194-117-205.compute-1.amazonaws.com:5432/dbmji6v13v7oqt')
        cur = conn.cursor()
        cur.execute("SELECT id, username, password from store")
        rows = cur.fetchall()
        found = False
        for row in rows:
            if(args['username'] == row[1] and args['password'] == row[2]):#username and password is correct
                found = True
                key = sha512(random.random()).hexdigest()
                update = "UPDATE Key set keyValue = "+str(key)+" create_at = "+str(time.time())+" where storeID="+row[0]
                cur.execute(update)
                status = 'success'
                message = str(key)
                break
        if not found:
            status = 'fail'
            message = 'Wrong username or password. Please try again.'
        
        return {'status':status, 'message':message}