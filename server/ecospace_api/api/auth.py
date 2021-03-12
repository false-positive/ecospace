import functools
from werkzeug.security import check_password_hash
from flask_restful import abort, Resource, reqparse
from ..models import User as UserModel
import datetime as dt
import jwt
from flask import current_app


user_form_parser = reqparse.RequestParser()
user_form_parser.add_argument('username')
user_form_parser.add_argument('password')
user_form_parser.add_argument('token')

class Auth(Resource):
    def post(self):
        args = user_form_parser.parse_args()
        valid = False
        username = args.get('username')
        password = args.get('password')
        user = UserModel.query.filter_by(username=username).first()
        if not user:
           abort(401, message=f'invalid username or password')
        token = None
        if check_password_hash(user.password, password):
           valid = True
           token = jwt.encode({
               'username': username,
               'exp': dt.datetime.utcnow() + dt.timedelta(hours=1),
               }, current_app.config['SECRET_KEY'], algorithm="HS256")
        if valid == False:
            abort(401, message=f'invalid username or password')
        return{
            'data': token,
            'message': 'successfully logged',
        }



def auth_token(view):

    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        args = user_form_parser.parse_args()
        try:
            payload = jwt.decode(args.get('token'),current_app.config['SECRET_KEY'] , algorithm="HS256")
            user = UserModel.query.filter_by(username=payload['username']).first()
            kwargs['current_user'] = user
        except jwt.ExpiredSignatureError:
            abort(401, message='expired token')

        except jwt.InvalidTokenError:
            abort(401, message='invalid token, pls dont try to bruteforce')

        return wrapped_view(*args, **kwargs)
    return wrapped_view
