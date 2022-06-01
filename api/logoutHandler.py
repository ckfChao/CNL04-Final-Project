from flask_restful import Api, Resource, reqparse
from flask import Response, request, redirect, make_response

class logoutHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn

    def get(self):
        if 'user_id' in self.session:
            self.session.pop('user_id', None) 
            self.session.pop('character', None) 
            response = make_response(redirect('/'))
            response.set_cookie('session', '', expires=0)
            return response
        else:
            res = Response(status=400)
            return res
        
