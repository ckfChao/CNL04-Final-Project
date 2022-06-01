from ntpath import join
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
from api.infoHandler import infoHandler
from api.eventHandler import eventHandler
from api.eventListHandler import eventListHandler
from api.eventListSelfHandler import eventListSelfHandler
from api.arriveHandler import arriveHandler
from api.inviteHandler import inviteHandler
from api.inviteIDHandler import inviteIDHandler
from api.joinEventHandler import joinEventHandler
from api.joinEventIDHandler import joinEventIDHandler
from api.rewardHandler import rewardHandler

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
api.add_resource(infoHandler, '/api/info', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(arriveHandler, '/api/arrive', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(rewardHandler, '/api/reward', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(inviteHandler, '/api/invite', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(inviteIDHandler, '/api/invite/<int:id>', endpoint = 'invite', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(eventListHandler, '/api/events',  endpoint = 'events', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(eventListSelfHandler, '/api/events/self', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(joinEventHandler, '/api/events/join', endpoint = 'join', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(joinEventIDHandler, '/api/events/join/<int:id>', resource_class_kwargs={'session': session, 'db_conn': db_conn})
api.add_resource(eventHandler, '/api/events/<int:id>',  endpoint = 'event', resource_class_kwargs={'session': session, 'db_conn': db_conn})

if __name__ == '__main__':
    app.run()