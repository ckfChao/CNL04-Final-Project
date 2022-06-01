from flask import Response
from flask_restful import Resource, reqparse
from datetime import datetime

class arriveHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn
    
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help='username is required',  type = str)
        parser.add_argument('password', required=True, help='password is required', type = str)
        parser.add_argument('key', required=True, help='identity is required', type = str)
        args = parser.parse_args()

        username = args['username']
        password = args['password']
        key = args['key']

        cur = self.db_conn.cursor()
        cur.execute(f"SELECT id FROM customer WHERE username='{username}' AND password='{password}'")
        row = cur.fetchall()
        cur.close()

        if len(row) == 1:
            user_id = row[0][0]
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT store_id FROM APKey WHERE key_value='{key}'")
            row = cur.fetchall()
            cur.close()

            if len(row) == 1:
                store_id = row[0][0]
                cur = self.db_conn.cursor()
                cur.execute(f"INSERT INTO arrive_record (arrive_at, user_id, store_id) VALUES ('{datetime.now()}', '{user_id}', '{store_id}');")
                self.db_conn.commit()
                cur.close()
                return Response(status=200)
            else:
                return { "message": { "error" : "username or password or key incorrect"}}, 400
        else:
            return { "message": { "error" : "username or password or key incorrect"}}, 400