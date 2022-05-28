from flask_restful import Api, Resource, reqparse, request
from flask import redirect, flash, make_response

  
class signupHandler(Resource):
  def get(self):
    return {
      'resultStatus': 'FAILURE',
      'message': "Wrong method"
      }

  def post(self):
    parser = reqparse.RequestParser()
    parser.add_argument('username', type=str)
    parser.add_argument('password', type=str)
    parser.add_argument('identity', type=str)
    
    args = parser.parse_args()
    
    request_username = args['username']
    request_password = args['password']
    request_identity = args['identity']
    
    print(args['username'])
    print(args['password'])
    print(args['identity'])

    print(args)
    
    if request_identity == 'store':
    
            return {"resultStatus": "SUCCESS", "message": "Signup successfully"}, 200
    elif request_identity == 'customer':
        
            return {"resultStatus": "SUCCESS", "message": "Signup successfully"}
    else:
        return {"resultStatus": "FAILURE", "message": "Wrong identity(not store neither customer)"}, 400
    
