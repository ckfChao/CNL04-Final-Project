from flask_restful import Api, Resource, reqparse
from flask import request

class HelloApiHandler(Resource):
  def __init__(self, session, db_conn):
    self.session = session
    self.db_conn = db_conn
  
  def get(self):
    request.cookies.get('uid')
    pass