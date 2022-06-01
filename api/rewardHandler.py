from select import select
from flask import Response
from flask_restful import Resource, reqparse

class rewardHandler(Resource):
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
            cur.execute(f"SELECT id, reward, is_used  FROM reward WHERE user_id={self.session['user_id']};")
            rows = cur.fetchall()
            cur.close()

            ret = {}
            ret['data'] = []
            for row in rows:
                row_data = {}
                row_data['id'] = row[0]
                row_data['reward'] = row[1]
                row_data['is_used'] = bool(row[2])
                ret['data'].append(row_data)
            
            return ret
        else:
            return {"message": {"error":"invalid character"}}, 400