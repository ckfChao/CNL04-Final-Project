from flask import Response
from flask_restful import Resource, reqparse

class eventHandler(Resource):
    def __init__(self, session, db_conn):
        self.session = session
        self.db_conn = db_conn

    #? Currently, return status code only
    def post(self):
        #! parse input from parser -> args[]
        parser = reqparse.RequestParser()
        parser.add_argument('username', required=True, help='username is required', type = str)
        args = parser.parse_args()

        #! check cookie
        if 'user_id' not in self.session or 'character' not in self.session:
            res = Response(status=400)
            return res

        #! check req type
        if 'req_type' not in args or args['req_type'] not in range(1,5):
            res = Response(status=400)
            return res

        #! 1) Post request
        if args['req_type'] == 1:
            #! Check character
            if self.session['character'] != 'store':
                res = Response(status=400)
                return res

            #! Check input
            #? Didn't check if each value is valid in checklist
            checklist = ['event_n', 'event_o', 'reward', 'invite_s', 'invite_e', 'event_s', 'event_e']
            sql_param = []
            for check in checklist:
                if check not in args:
                    res = Response(status=400)
                    return res
                else:
                    sql_param.append(args[check]) 
            sql_param.append(self.session['user_id'])  

            '''
            CREATE TABLE event (
                id serial    PRIMARY KEY,
                event_name   VARCHAR ( 50 ) UNIQUE NOT NULL,
                event_owner  VARCHAR ( 50 ) NOT NULL,
                reward       VARCHAR ( 50 ) NOT NULL,
                invite_start TIMESTAMP NOT NULL,
                invite_end   TIMESTAMP NOT NULL,
                event_start  TIMESTAMP NOT NULL,
                event_end    TIMESTAMP NOT NULL
            );
            CREATE TABLE event ( id serial    PRIMARY KEY, event_name   VARCHAR ( 50 ) UNIQUE NOT NULL, event_owner  VARCHAR ( 50 ) NOT NULL, reward       VARCHAR ( 50 ) NOT NULL, invite_start TIMESTAMP NOT NULL, invite_end   TIMESTAMP NOT NULL, event_start  TIMESTAMP NOT NULL, event_end    TIMESTAMP NOT NULL);
            '''

            #! Insert event            
            #? reward & event_owner should be str /or int?
            #? how to get time input from arg[]?
            #? check query's return code?
            ''' (example)
            INSERT INTO event (event_name, reward, invite_start, invite_end, event_start, event_end, event_owner) 
            VALUES ('event1', '20%', '1212-12-12  12:12:12', '1212-12-12  12:12:12', '1212-12-12  12:12:12', '1212-12-12  12:12:12', '99');
            INSERT INTO event (event_name, reward, invite_start, invite_end, event_start, event_end, event_owner) VALUES ('event1', '20%', '1212-12-12  12:12:12', '1212-12-12  12:12:12', '1212-12-12  12:12:12', '1212-12-12  12:12:12', '99');
            '''
            cur = self.db_conn.cursor()
            cur.execute("INSERT INTO event (event_name, reward, invite_start, invite_fin, event_start, event_fin, event_owner) VALUES (%s, %s, %s, %s, %s, %s, %s);" \
                        , sql_param)
            self.db_conn.commit()
            cur.close()

            res = Response(status=200)
            return res

        #! 2) Modify request
        elif args['req_type'] == 2:
            #! Check character
            if self.session['character'] != 'store':
                res = Response(status=400)
                return res

            #! check if this event exist & if this is the event owner
            if 'id' not in args:
                res = Response(status=400)
                return res
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT event_name, reward, invite_start, invite_end, event_start, event_end, event_owner FROM event WHERE id={args[id]}")
            rows = cur.fetchall()
            cur.close()

            if len(rows) == 0 or rows[0][-1] != self.session['user_id']:
                res = Response(status=400)
                return res
            else:
                modify_var = ['event_n', 'reward', 'invite_s', 'invite_e', 'event_s', 'event_e', 'event_o']
                sql_params = []
                for idx, var in enumerate(modify_var):
                    if var not in args:
                        sql_param.append(rows[0][idx])
                    else:
                        sql_param.append(args[var])
                
                cur = self.db_conn.cursor()
                cur.execute(f"UPDATE event SET event_name={sql_param[0]}, reward={sql_param[1]}, invite_start={sql_param[2]}, invite_end={sql_param[3]}, event_start={sql_param[4]}, event_end={sql_param[5]}, event_owner={sql_param[6]} WHERE id={args[id]}")
                self.db_conn.commit()
                cur.close()
            
                res = Response(status=200)
                return res
        #! 3) Delete request
        elif args['req_type'] == 3:
            #! Check character
            if self.session['character'] != 'store':
                res = Response(status=400)
                return res

            #! check if this event exist & if this is the event owner
            if 'id' not in args:
                res = Response(status=400)
                return res
            cur = self.db_conn.cursor()
            cur.execute(f"SELECT event_owner FROM event WHERE id={args[id]}")
            rows = cur.fetchall()
            cur.close()

            if len(rows) == 0 or rows[0][0] != self.session['user_id']:
                res = Response(status=400)
                return res
            else:
                cur = self.db_conn.cursor()
                cur.execute(f"DELETE from event WHERE id={args[id]}")
                self.db_conn.commit()
                cur.close()
            
                res = Response(status=200)
                return res
        #! 4) Get request
        elif args['req_type'] == 3:
            #? Write your code here
            res = Response(status=200)
            return res