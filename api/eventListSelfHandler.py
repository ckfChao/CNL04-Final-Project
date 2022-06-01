from flask import Response
from flask_restful import Resource, reqparse

class eventListSelfHandler(Resource):
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
    
    def _check_progress(self, event_id):
        if self._checkValidCustomerSession():
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT event_owner, event_start, event_end FROM event WHERE id='{event_id}';")
            row = cur.fetchall()
            cur.close()

            ret = {}
            if len(row) == 1:
                event_owner_id = row[0][0]
                event_start = row[0][1]
                evnet_end = row[0][2]

                cur = self.db_conn.cursor()
                cur.execute(f"SELECT store_name FROM store WHERE id='{event_owner_id}';")
                row = cur.fetchall()
                cur.close()

                if len(row) == 1:
                    event_owner_store_name = row[0][0]    

                    cur = self.db_conn.cursor()
                    cur.execute(f"SELECT id, store_name FROM store WHERE id IN (SELECT partner_id FROM event_partner WHERE event_id={event_id});")
                    rows = cur.fetchall()
                    cur.close()

                    id_store_name = [(event_owner_id, event_owner_store_name)]
                    id_store_name += rows
                    
                    for id, store_name in id_store_name:
                        cur = self.db_conn.cursor()
                        cur.execute(f"SELECT id FROM arrive_record WHERE user_id='{self.session['user_id']}' AND store_id='{id}' AND arrive_at >= timestamp '{event_start}' AND  arrive_at <= timestamp '{evnet_end}';")
                        rows = cur.fetchall()
                        cur.close()

                        if len(rows) > 0:
                            ret[store_name] = True
                        else:
                            ret[store_name] = False
                    
                    return all( isArrive for isArrive in ret.values()), ret
                else:
                    return False, None,
            else:
                return False, None
        else:
            return False, None

    def get(self):
        if self._checkValidStoreSession():
            cur = self.db_conn.cursor()
            cols = ['id', 'event_name', 'event_owner', 'reward', 'invite_start', 'invite_end', 'event_start', 'event_end']
            cur.execute(f"SELECT {', '.join(cols)} FROM event WHERE event_owner={self.session['user_id']}")
            rows = cur.fetchall()
            cur.close()

            cur = self.db_conn.cursor()
            cur.execute(f"SELECT username FROM store WHERE id={self.session['user_id']};")
            username_row = cur.fetchall()
            cur.close()

            if len(username_row) != 1:
                return {"message": {"error":"invalid event"}}, 400

            ret = {}
            ret['data'] = []
            for row in rows:
                row_data = { cols[i] : str(row[i]) for i in range(len(row))}
                row_data['username'] = username_row[0][0]
                ret['data'].append(row_data)

            return ret
        elif self._checkValidCustomerSession():
            cur = self.db_conn.cursor()
            cols = ['id', 'event_name', 'event_owner', 'reward', 'invite_start', 'invite_end', 'event_start', 'event_end']
            cur.execute(f"SELECT {', '.join(cols)} FROM event WHERE id IN (SELECT event_id FROM event_participant WHERE user_id={self.session['user_id']} AND is_finish=0);")
            rows = cur.fetchall()
            cur.close()

            ret = {}
            ret['data'] = {}
            ret['data']['unfinish'] = []
            for row in rows:
                isFinish, progress = self._check_progress(row[0])
                if isFinish:
                    print(f"UPDATE event_participant SET is_finish=1 WHERE user_id={self.session['user_id']} AND event_id={row[0]});")
                    cur = self.db_conn.cursor()
                    cur.execute(f"UPDATE event_participant SET is_finish=1 WHERE user_id={self.session['user_id']} AND event_id={row[0]};")
                    cur.execute(f"INSERT INTO reward (user_id, reward, is_used) VALUES ('{self.session['user_id']}', '{row[3]}', '{0}');")
                    self.db_conn.commit()
                    cur.close()
                    continue

                cur = self.db_conn.cursor()
                cur.execute(f"SELECT username FROM store WHERE id={row[2]};")
                username_row = cur.fetchall()
                cur.close()

                row_data = { cols[i] : str(row[i]) for i in range(len(row))}
                row_data['username'] = username_row[0][0]
                row_data['progress'] = [ {"store_name": key, "is_arrive": progress[key]} for key in progress.keys() ]
                ret['data']['unfinish'].append(row_data)

            
            cur = self.db_conn.cursor()
            cols = ['id', 'event_name', 'event_owner', 'reward', 'invite_start', 'invite_end', 'event_start', 'event_end']
            cur.execute(f"SELECT {', '.join(cols)} FROM event WHERE id IN (SELECT event_id FROM event_participant WHERE user_id={self.session['user_id']} AND is_finish=1);")
            rows = cur.fetchall()
            cur.close()

            ret['data']['finish'] = []
            for row in rows:
                cur = self.db_conn.cursor()
                cur.execute(f"SELECT username FROM store WHERE id={row[2]};")
                username_row = cur.fetchall()
                cur.close()

                row_data = { cols[i] : str(row[i]) for i in range(len(row))}
                row_data['username'] = username_row[0][0]
                ret['data']['finish'].append(row_data)

            return ret
        else:
            return {"message": {"error":"invalid character"}}, 400
