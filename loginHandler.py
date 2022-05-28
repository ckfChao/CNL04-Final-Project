import flask
import os
from flask import Flask, session, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS, cross_origin
from api.HelloApiHandler import HelloApiHandler
from datetime import timedelta
from dotenv import load_dotenv
import psycopg2

@app.route('/api/login',methods=['GET','POST'])

class loginHandler(Resource):
    def __init__(self, session, conn):
        self.session = session
        self.conn = conn

    def post(self, username, password, identity, key):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help='username is required',  type = str)
        parser.add_argument('password', required=True, help='password is required', type = str)
        parser.add_argument('identity', required=True, help='identity is required', type = str)
        args = parser.parse_args()

        conn = psycopg2.connect('postgres://dmrakrvfzancyh:a49bc74ae56e0cc09276c48bbf575320e4d2ef803e7cf2c9923d61c9d7409dbb@ec2-44-194-117-205.compute-1.amazonaws.com:5432/dbmji6v13v7oqt')
        cur = conn.cursor()
        s = "SELECT id, username, password FROM "
        s += args['identity']
        s += " WHERE username=\'"
        s += args['username']
        s += "\';"
        cur.execute(s)
        rows = cur.fetchall()
        found = False

        if(len(rows) == 1 and args['password'] == rows[2]):
            found = True
            status = "success"
            message = "Set cookie and redirect"
        if not found:
            status = "fail"
            message = "Username or password is incorrect. Please try again"

        return {'status':status, 'message': message}
