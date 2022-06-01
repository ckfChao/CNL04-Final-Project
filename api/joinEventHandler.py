from flask import Response
from flask_restful import Resource, reqparse

class joinEventHandler(Resource):
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
        if self._checkValidCustomerSession():
            cur = self.db_conn.cursor()
            cols = ['id', 'event_name', 'event_owner', 'reward', 'invite_start', 'invite_end', 'event_start', 'event_end']
            cur.execute(f"SELECT {', '.join(cols)} FROM event WHERE id NOT IN (SELECT event_id FROM event_participant WHERE user_id='{self.session['user_id']}');")
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
        else:
            return {"message": {"error":"invalid character"}}, 400
