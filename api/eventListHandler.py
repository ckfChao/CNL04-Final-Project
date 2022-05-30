from ast import arg
from datetime import datetime
from flask import Response
from flask_restful import Resource, reqparse

class eventListHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn
    
    def _checkValidStoreSession(self):
        if 'user_id' in self.session and self.session['character'] == 'store':
            return True
        else:
            return False
    
    def _checkValidCustomerSession(self):
        if 'user_id' in self.session and self.session['character'] == 'customer':
            return True
        else:
            return False

    def get(self):
        cur = self.db_conn.cursor()
        cols = ['id', 'event_name', 'event_owner', 'reward', 'invite_start', 'invite_end', 'event_start', 'event_end']
        cur.execute(f"SELECT {', '.join(cols)} FROM event")
        rows = cur.fetchall()
        cur.close()

        ret = {}
        ret['data'] = []
        for row in rows:
            row_data = { cols[i] : str(row[i]) for i in range(len(row))}
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT username FROM store WHERE id={row[2]};")
            username_row = cur.fetchall()
            if len(username_row) == 1:
                row_data['username'] = username_row[0][0]
            else:
                return {"message": {"error":"invalid event"}}, 400
            ret['data'].append(row_data)

        return ret

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('event_name', required=True, help='name of event is required', type = str)
        parser.add_argument('reward', required=True, help='reward is required', type = str)
        parser.add_argument('invite_start', required=True, help='starting time of invitation is required', type=lambda x: datetime.strptime(x,'%Y-%m-%dT%H:%M:%S'))
        parser.add_argument('invite_end', required=True, help='ending time of invitation is required', type=lambda x: datetime.strptime(x,'%Y-%m-%dT%H:%M:%S'))
        parser.add_argument('event_start', required=True, help='starting time of event is required', type=lambda x: datetime.strptime(x,'%Y-%m-%dT%H:%M:%S'))
        parser.add_argument('event_end', required=True, help='ending time of event is required', type=lambda x: datetime.strptime(x,'%Y-%m-%dT%H:%M:%S'))
        args = parser.parse_args()

        event_name = args['event_name']
        reward = args['reward']
        invite_start = args['invite_start']
        invite_end = args['invite_end']
        event_start = args['event_start']
        event_end = args['event_end']

        if not (event_end > event_start > invite_end > invite_start):
            return {"message": {"error":"invalid datetime"}}, 400

        if self._checkValidStoreSession():
            cur = self.db_conn.cursor()
            cur.execute(f"INSERT INTO event (event_name, event_owner, reward, invite_start, invite_end, event_start, event_end) VALUES ('{event_name}', '{self.session['user_id']}', '{reward}', '{invite_start}', '{invite_end}', '{event_start}', '{event_end}');")
            self.db_conn.commit()
            cur.close()
            return Response(status=200)
        else:
            return {"message": {"error":"invalid character"}}, 400