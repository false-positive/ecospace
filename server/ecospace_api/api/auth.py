import functools
import datetime as dt

from flask import current_app, make_response
from flask_restful import abort, Resource, request
from werkzeug.security import check_password_hash
import jwt

from ..models import UserModel


class AuthResource(Resource):
    """Endpoint for user authentication with JWTs"""
    def get(self):
        # Get username and password from HTTP Basic authentication
        # https://www.youtube.com/watch?v=VW8qJxy4XcQ
        auth = request.authorization
        if not auth or not auth.password or not auth.username:
            return make_response(
                'missing username and password', 401,
                {'WWW-Authenticate': 'Basic realm="Login required!"'}
            )
        user = UserModel.query.filter_by(username=auth.username).first()
        if user and check_password_hash(user.password, auth.password):
            token = jwt.encode({
                'username': auth.username,
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
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            user = UserModel.query.filter_by(username=payload['username']).first()
            kwargs['current_user'] = user
        except jwt.ExpiredSignatureError:
            abort(401, message='expired token')
        except jwt.InvalidTokenError:
            abort(401, message='invalid token, pls dont try to bruteforce')
        return view(*args, **kwargs)

    return wrapped_view
