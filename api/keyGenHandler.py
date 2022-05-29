from flask_restful import Api, Resource, reqparse
from flask import Response
from datetime import datetime
import secrets

class keyGenHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help='username is required', type = str)
        parser.add_argument('password', required=True, help='password is required', type = str)
        args = parser.parse_args()

        cur = self.db_conn.cursor()
        cur.execute(f"SELECT id, username, password from store WHERE username='{args['username']}' AND password='{args['password']}'")
        rows = cur.fetchall()
        cur.close()

        if len(rows) == 1:
            store_id = rows[0][0]
            key = None

            # Generate a key which is unquie
            while True:
                key = secrets.token_hex(nbytes=32)
                cur = self.db_conn.cursor()
                cur.execute(f"SELECT id FROM APKey WHERE key_value='{key}'")
                rows = cur.fetchall()
                if len(rows) == 0:
                    break

            cur = self.db_conn.cursor()
            cur.execute(f"SELECT id, key_value, create_at, valid_time FROM APKey WHERE store_id={store_id}")
            rows = cur.fetchall()
            cur.close()

            if len(rows) == 0:
                cur = self.db_conn.cursor()
                cur.execute(f"INSERT INTO APKey (store_id, key_value, create_at, valid_time) VALUES ('{store_id}', '{key}', '{datetime.now()}', '{86400}')")
                self.db_conn.commit()
                cur.close()
                return { "key": key }
            else:
                id = rows[0][0]
                db_key = rows[0][1]
                create_at = rows[0][2]
                valid_time = rows[0][3]

                if (datetime.now() - create_at).total_seconds() > valid_time:
                    cur = self.db_conn.cursor()
                    cur.execute(f"UPDATE APkey SET key_value='{key}', create_at='{datetime.now()}', valid_time='86400' WHERE id={id}")
                    self.db_conn.commit()
                    cur.close()
                    return { "key": key }
                
                return { "key": db_key }
        else:
            return { "message": { "error" : "username or password incorrect"}}, 400