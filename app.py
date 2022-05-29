from tabnanny import check
import flask
import os
from flask import Flask, session, send_from_directory
from flask_restful import Api, Resource, reqparse
from flask_cors import CORS, cross_origin
from datetime import timedelta
from dotenv import load_dotenv
import psycopg2

from api.keyGenHandler import keyGenHandler
from api.loginHandler import loginHandler
from api.signupHandler import signupHandler
from api.logoutHandler import logoutHandler
from api.checkSessionHandler import checkSessionHandler

load_dotenv()

db_conn = psycopg2.connect(os.getenv('DATABASE_URL'))

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
app.config['SECRET_KEY'] = os.getenv('SESSION_SECRET')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
CORS(app)
api = Api(app)

@app.route('/')
@cross_origin()
def serve():
    return send_from_directory(app.static_folder, 'index.html')

api.add_resource(keyGenHandler, '/api/keyGen', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(loginHandler, '/api/login', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(signupHandler, '/api/signup', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(logoutHandler, '/api/logout', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(checkSessionHandler, '/api/session', resource_class_kwargs={'session': session, 'db_conn': db_conn})

if __name__ == '__main__':
    app.run()