from flask import Response, session
from flask_restful import Resource, reqparse
from datetime import datetime

class inviteIDHandler(Resource):
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
    
    def patch(self, id):
        if self._checkValidStoreSession(): 
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT event_id, reciever_id FROM invite WHERE id='{id}';")
            row = cur.fetchall()
            cur.close()

            if len(row) == 1 and row[0][1] == self.session['user_id']:
                event_id = row[0][0]

                cur = self.db_conn.cursor()
                cur.execute(f"INSERT INTO event_partner (event_id, partner_id) VALUES ('{event_id}', '{self.session['user_id']}');")
                self.db_conn.commit() 
                cur.execute(f"DELETE FROM invite WHERE id='{id}';")
                self.db_conn.commit() 
                cur.close()

                return Response(status=200)
            else:
                return { "message": { "error" : "invalid id"}}, 400
        else:
            return { "message": { "error" : "invalid session"}}, 400
    
    def delete(self, id):
        if self._checkValidStoreSession(): 
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT event_id, reciever_id FROM invite WHERE id='{id}';")
            row = cur.fetchall()
            cur.close()

            if len(row) == 1 and row[0][1] == self.session['user_id']:
                cur = self.db_conn.cursor()
                cur.execute(f"DELETE FROM invite WHERE id='{id}';")
                self.db_conn.commit() 
                cur.close()
                return Response(status=200)
            else:
                return { "message": { "error" : "invalid id"}}, 400
        else:
            return { "message": { "error" : "invalid session"}}, 400
