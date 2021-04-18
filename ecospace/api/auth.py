import functools

from flask import make_response
from flask_restful import abort, Resource, request
from werkzeug.security import check_password_hash, generate_password_hash
import jwt

from ..models import UserModel, db
from .user import user_form_parser


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
            token = user.encode_auth_token()
            return {
                'data': token,
                'message': 'successfully logged',
            }
        return {
            'message': 'invalid username or password',
        }

    def post(self):
        """Register a new user"""
        args = user_form_parser.parse_args()

        # Check if username is unique
        username = args.get('username')
        if UserModel.query.filter_by(username=username).first() is not None:
            abort(401, message=f'user {username} already registered')

        new_user = UserModel(
            username=username,
            first_name=args.get('first_name'),
            last_name=args.get('last_name'),
            password=generate_password_hash(args.get('password'))
        )
        db.session.add(new_user)
        db.session.commit()
        return {
            'data': {new_user.username: new_user.get_response()},
            'message': 'user registered successfully',
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
            user = UserModel.decode_auth_token(token)
            kwargs['current_user'] = user
        except jwt.ExpiredSignatureError:
            abort(401, message='expired token')
        except jwt.InvalidTokenError:
            abort(401, message='invalid token, pls dont try to bruteforce')
        return view(*args, **kwargs)

    return wrapped_view
