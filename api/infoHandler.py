from flask_restful import Api, Resource, reqparse
from flask import Response
import psycopg2

class infoHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn
    
    def get(self):
        if 'user_id' in self.session:
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT store_name, intro, address from store WHERE id='{self.session['user_id']}'")
            row = cur.fetchall()
            cur.close()

            if len(row) == 1:
                return {"message": {"store name":row[0][0], "intro":row[0][1], "address":row[0][2]}}
            else:
                return ("message": {"error":"Information not found"}), 400
        else:
            return {"message": {"error":"Cookie not found"}}, 400
    
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("new store name", required=False,  type = str)
        parser.add_argument("new intro", required=False, type = str)
        parser.add_argument("new address", required=False, type = str)
        args = parser.parse_args()

        if len(args) == 0:
            return ("message": {"error":"No new information"}), 400

        if 'user_id' in self.session:
            store_id = self.session['user_id']
            cur = self.db_conn.cursor()
            if "new store name" in args:
                cur.execute(f"UPDATE store SET store_name='{args["new store name"]}' WHERE id={store_id}")
                self.db_conn.commit()
            
            if "new intro" in args:
                cur.execute(f"UPDATE store SET intro='{args["new intro"]}' WHERE id={store_id}")
                self.db_conn.commit()
            
            if "new address" in args:
                cur.execute(f"UPDATE store SET address='{args["new address"]}' WHERE id={store_id}")
                self.db_conn.commit()
            
            cur.close()
            res = Response(200)
            return res
        else:
            return {"message": {"error":"Cookie not found"}}, 400