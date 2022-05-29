from flask import Response
from flask_restful import Resource, reqparse

class loginHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help='username is required',  type = str)
        parser.add_argument('password', required=True, help='password is required', type = str)
        parser.add_argument('character', required=True, help='identity is required', type = str)
        args = parser.parse_args()

        if args['character'] != 'customer' and args['character'] != 'store':
            return { "message": { "character" : "character must be customer or store."}}, 400

        cur = self.db_conn.cursor()
        s = "SELECT id, username, password FROM "
        s += args['character']
        s += " WHERE username=\'"
        s += args['username']
        s += "\';"
        cur.execute(s)
        rows = cur.fetchall()
        cur.close()

        if(len(rows) == 1 and args['password'] == rows[0][2]):
            self.session['user_id'] = rows[0][0]
            self.session['character'] = args['character']
            res = Response(status=200)
            return res
        else:
            return { "message": { "error" : "username or password incorrect"}}, 400
