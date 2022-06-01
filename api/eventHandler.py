from flask import Response
from flask_restful import Resource, reqparse
from datetime import datetime

class eventHandler(Resource):
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

    def get(self, id):
        cols = ['id', 'event_name', 'event_owner', 'reward', 'invite_start', 'invite_end', 'event_start', 'event_end']
        cur = self.db_conn.cursor()
        cur.execute(f"SELECT {', '.join(cols)} FROM event WHERE id={id}")
        row = cur.fetchall()
        cur.close()

        if len(row) == 1:
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT username FROM store WHERE id={row[0][2]};")
            username_row = cur.fetchall()
            cur.close()

            if len(username_row) != 1:
                return {"message": {"error":"invalid event"}}, 400
            
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT username FROM store WHERE id IN (SELECT partner_id FROM event_partner WHERE event_id='{id}');")
            partner_username_rows = cur.fetchall()
            cur.close()

            cur = self.db_conn.cursor()
            cur.execute(f"SELECT COUNT(*) FROM event_participant WHERE event_id='{id}';")
            count_partic_row = cur.fetchall()
            cur.close()

            cur = self.db_conn.cursor()
            cur.execute(f"SELECT COUNT(*) FROM event_participant WHERE event_id='{id}' AND is_finish=1;")
            finish_count_partic_row = cur.fetchall()
            cur.close()

            row_data = { cols[i] : str(row[0][i]) for i in range(len(cols))}
            row_data['username'] = username_row[0][0]
            row_data['partners'] = [ partner_username_row[0] for partner_username_row in partner_username_rows]
            row_data['count_partic'] = count_partic_row[0][0]
            row_data['finish_count_partic'] = finish_count_partic_row[0][0]
            return row_data
        else:
            return {"message": {"error":"invalid id"}}, 400

    def patch(self, id):
        if self._checkValidStoreSession():
            cols = ['id', 'event_name', 'event_owner', 'reward', 'invite_start', 'invite_end', 'event_start', 'event_end']
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT {', '.join(cols)} FROM event WHERE id={id}")
            row = cur.fetchall()
            cur.close()

            db_invite_start = row[0][4]
            db_invite_end = row[0][5]
            db_event_start = row[0][6]
            db_event_end = row[0][7]

            if len(row) == 1 and row[0][2] == self.session['user_id']:
                parser = reqparse.RequestParser()
                parser.add_argument("event_name", required=False,  type = str)
                parser.add_argument("reward", required=False, type = str)
                parser.add_argument("invite_start", required=False, type=lambda x: datetime.strptime(x,'%Y-%m-%dT%H:%M:%S'))
                parser.add_argument("invite_end", required=False, type=lambda x: datetime.strptime(x,'%Y-%m-%dT%H:%M:%S'))
                parser.add_argument("event_start", required=False, type=lambda x: datetime.strptime(x,'%Y-%m-%dT%H:%M:%S'))
                parser.add_argument("event_end", required=False, type=lambda x: datetime.strptime(x,'%Y-%m-%dT%H:%M:%S'))
                args = parser.parse_args()

                new_invite_start = args['invite_start'] if args['invite_start'] != None else db_invite_start
                new_invite_end = args['invite_end'] if args['invite_end'] != None else db_invite_end
                new_event_start = args['event_start'] if args['event_start'] != None else db_event_start
                new_event_end = args['event_end'] if args['event_end'] != None else db_event_end

                if not (new_event_end > new_event_start > new_invite_end > new_invite_start):
                    return {"message": {"error":"invalid datetime"}}, 400

                cur = self.db_conn.cursor()
                for key in args.keys():
                    if args[key] != None:
                        cur.execute(f"UPDATE event SET {key}='{args[key]}' WHERE id={id}")
                        self.db_conn.commit()
                
                cur.close()
                res = Response(status=200)
                return res
            else:
                return {"message": {"error":"invalid id"}}, 400
        else:
            return {"message": {"error":"invalid character"}}, 400

    def delete(self, id):
        if self._checkValidStoreSession():
            cols = ['id', 'event_name', 'event_owner', 'reward', 'invite_start', 'invite_end', 'event_start', 'event_end']
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT {', '.join(cols)} FROM event WHERE id={id}")
            row = cur.fetchall()
            cur.close()
            
            if len(row) == 1 and row[0][2] == self.session['user_id']:
                cur = self.db_conn.cursor()
                cur.execute(f'DELETE FROM event WHERE id={id};')
                self.db_conn.commit()
                cur.close()

                return Response(status=200)
            else:
                return {"message": {"error":"invalid id"}}, 400
        else:
            return {"message": {"error":"invalid character"}}, 400