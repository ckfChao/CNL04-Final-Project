from flask_restful import Api, Resource, reqparse
from flask import Response, request, redirect

class checkSessionHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn

    def get(self):
        if 'user_id' in self.session:
            return {'character': self.session['character']}, 200
        else:
            res = Response(status=400)
            return res