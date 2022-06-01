from flask import Response
from flask_restful import Resource, reqparse
from datetime import datetime
from flask import request

class inviteHandler(Resource):
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
        if self._checkValidStoreSession():
            user_id = self.session['user_id']

            cur = self.db_conn.cursor()
            cur.execute(f"SELECT id, event_id, event_owner FROM invite WHERE reciever_id='{user_id}';")
            rows = cur.fetchall()
            cur.close()

            res = {}
            res['data'] = []
            for row in rows:
                cur = self.db_conn.cursor()
                cur.execute(f"SELECT event_name FROM event WHERE id='{row[1]}';")
                event_datas = cur.fetchall()
                cur.close()

                if len(event_datas) == 0:
                    return Response(400)

                cur = self.db_conn.cursor()
                cur.execute(f"SELECT username FROM store WHERE id='{row[2]}';")
                event_owner_datas = cur.fetchall()
                cur.close()

                if len(event_owner_datas) == 0:
                    return Response(400)
                    
                res['data'].append({'invite_id': row[0], 'event_id': row[1], 'event_owner': row[2], 'event_owner_username': event_owner_datas[0][0], 'event_name': event_datas[0][0]})
            return res
        else:
            return { "message": { "error" : "invalid session"}}, 400

    def post(self):
        print(request.data)
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help='username is required',  type = str)
        parser.add_argument('id', required=True, help='username is required',  type = int)
        args = parser.parse_args()

        print(args)

        if self._checkValidStoreSession():
        
            username = args['username']
            event_id = args['id']
            
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT id FROM store WHERE username='{username}'")
            row = cur.fetchall()
            cur.close()

            if len(row) == 1:
                user_id = row[0][0]
                
                cur = self.db_conn.cursor()
                cur.execute(f"SELECT id FROM event WHERE id='{event_id}' AND event_owner='{self.session['user_id']}';")
                row = cur.fetchall()
                cur.close()
                
                if len(row) == 1:
                    cur = self.db_conn.cursor()
                    cur.execute(f"INSERT INTO invite (event_id, reciever_id, event_owner) VALUES ('{event_id}', '{user_id}', '{self.session['user_id']}');")
                    self.db_conn.commit()
                    cur.close()
                    return Response(status=200)
                else:
                    return { "message": { "error" : "username not found"}}, 400
            else:
                return { "message": { "error" : "username not found"}}, 400
        else:
            return { "message": { "error" : "invalid session"}}, 400