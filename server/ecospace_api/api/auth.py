import functools
import datetime as dt

from flask import current_app
from flask_restful import abort, Resource, reqparse, request
from werkzeug.security import check_password_hash
import jwt

from ..models import User as UserModel

user_form_parser = reqparse.RequestParser()
user_form_parser.add_argument('username', required=True)
user_form_parser.add_argument('password', required=True)


class AuthResource(Resource):
    """Endpoint for user authentication with JWTs"""
    def get(self):
        args = user_form_parser.parse_args()
        username = args.get('username')
        password = args.get('password')
        user = UserModel.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            token = jwt.encode({
                'username': username,
                'exp': dt.datetime.utcnow() + dt.timedelta(hours=1),
            }, current_app.config['SECRET_KEY'], algorithm="HS256")
            return {
                'data': token,
                'message': 'successfully logged',
            }
        return {
            'message': 'invalid username or password',
        }


def auth_token(view):
    """
    Get a JWT from the request header and verify it.
    If it is valid, call the passed view function/method.
    If it's invalid or has exipred, return a 401
    """

    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            abort(401, message='token is missing .-.')
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithm="HS256")
            user = UserModel.query.filter_by(username=payload['username']).first()
            kwargs['current_user'] = user
        except jwt.ExpiredSignatureError:
            abort(401, message='expired token')
        except jwt.InvalidTokenError:
            abort(401, message='invalid token, pls dont try to bruteforce')
        return wrapped_view(*args, **kwargs)

    return wrapped_view
