from flask import Response
from flask_restful import Resource, reqparse

class joinEventIDHandler(Resource):
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
        if self._checkValidCustomerSession():
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT id FROM event_participant WHERE event_id='{id}' AND user_id='{self.session['user_id']}';")
            row = cur.fetchall()
            cur.close()

            if len(row) > 0:
                return {"message": {"error":"invalid id"}}, 400
            

            cur = self.db_conn.cursor()
            cur.execute(f"SELECT id FROM event WHERE id='{id}'")
            row = cur.fetchall()
            cur.close()

            if len(row) == 1:
                cur = self.db_conn.cursor()
                cur.execute(f"INSERT INTO event_participant (event_id, user_id, is_finish) VALUES ('{id}', '{self.session['user_id']}', '{0}')")
                self.db_conn.commit()
                cur.close()               

                return Response(status=200)
            else:
                return {"message": {"error":"invalid id"}}, 400
        else:
            return {"message": {"error":"invalid character"}}, 400
