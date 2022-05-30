from flask_restful import Api, Resource, reqparse
from flask import Response
import psycopg2

class infoHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn
    
    def get(self):
        if 'user_id' in self.session:
            user_id = self.session['user_id']
            tablename = self.session['character']

            if tablename == "store":
                cur = self.db_conn.cursor()
                cur.execute(f"SELECT username, store_name, intro, address from store WHERE id={user_id}")
                rows = cur.fetchall()
                cur.close()

                if len(rows) >= 1:
                    return {"username": rows[0][0], "store name": rows[0][1], "intro": rows[0][2], "address": rows[0][3]}
                else:
                    return {"message": {"error":"Information not found"}}, 400
            elif tablename == "customer":
                cur = self.db_conn.cursor()
                cur.execute(f"SELECT username from customer WHERE id={user_id}")
                rows = cur.fetchall()
                cur.close()

                if len(rows) >= 1:
                    return { "username": rows[0][0] }
                else:
                    return {"message": {"error":"Information not found"}}, 400
            else:
                return {"message": {"error":"Information not found"}}, 400
        else:
            return {"message": {"error":"Cookie not found"}}, 400
    
    def patch(self):
        parser = reqparse.RequestParser()
        parser.add_argument("store_name", required=False,  type = str)
        parser.add_argument("intro", required=False, type = str)
        parser.add_argument("address", required=False, type = str)
        args = parser.parse_args()

        if len(args) == 0:
            return {"message": {"error":"No new information"}}, 400

        if 'user_id' in self.session and self.session['character'] == 'store':

            store_id = self.session['user_id']
            cur = self.db_conn.cursor()

            for key in args.keys():
                if args[key] != None:
                    cur.execute(f"UPDATE store SET {key}='{args[key]}' WHERE id={store_id}")
                    self.db_conn.commit()
            
            cur.close()
            res = Response(status=200)
            return res
        else:
            return {"message": {"error":"Cookie not found"}}, 400