from flask_restful import Api, Resource, reqparse
from flask import request, redirect

class logoutHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn
    def get(self):
        uid = request.cookies.get('uid')
        del flask.session[uid]
        return redirect("/", code=302)
