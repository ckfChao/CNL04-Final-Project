from flask_restful import Api, Resource, reqparse
from flask import Response, request, redirect

class logoutHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn

    def get(self):
        if 'user_id' in self.session:
            self.session.pop('user_id', None) 
            self.session.pop('character', None) 

            res = Response(status=200)
            return res
        else:
            res = Response(status=400)
            return res
        
