from flask_restful import Resource, reqparse
from flask import Response
from datetime import datetime

class signupHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn  
  
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help='username is required', type=str)
        parser.add_argument('password', required=True, help='password is required', type=str)
        parser.add_argument('character', required=True, help='identity is required', type=str)
        args = parser.parse_args()
        
        req_username = args['username']
        req_password = args['password']
        req_character = args['character']

        if req_character != 'customer' and req_character != 'store':
            return { "message": { "character" : "character must be customer or store."}}, 400
        
        cur = self.db_conn.cursor()
        cur.execute(f"SELECT id FROM {req_character} WHERE username='{req_username}';")
        find = cur.fetchall()
        cur.close()

        if not find:
            cur = self.db_conn.cursor()
            cur.execute(f"INSERT INTO {req_character} (username, password, created_on) VALUES ('{req_username}', '{req_password}', '{datetime.now()}');")
            self.db_conn.commit()
            cur.close()
            res = Response(200)
            return res
        else:
            return { "message": { "username" : "The username have been used."}}, 400