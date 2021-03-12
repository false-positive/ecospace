import functools
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restful import abort, Resource, reqparse

from ..models import User as UserModel, db  # TODO: Maybe rename the models to prevent collisions like this


user_form_parser = reqparse.RequestParser()
user_form_parser.add_argument('username', required=True)
user_form_parser.add_argument('full_name', required=True)
user_form_parser.add_argument('password', required=True)


def pass_user(view):
    """Decorator to pass a user a parameter to a view"""

    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        if 'username' in kwargs:
            username = kwargs.pop('username')
            user = UserModel.query.filter_by(username=username).first()
            if not user:
                abort(404, message=f'user with username {username} doesnt exist')
            kwargs['user'] = user
        return view(*args, **kwargs)

    return wrapped_view


class UserList(Resource):
    def get(self):
        users = UserModel.query.all()
        result = {}
        for user in users:
            response = user.get_response()
            username = response.pop('username')
            result[username] = response
        return {
            'data': result,
            'message': 'users listed successfully',
        },
    def post(self):
        args = user_form_parser.parse_args()
        new_user = UserModel(id = None, username=args.get('username'), full_name=args.get('full_name'), password=generate_password_hash(args.get('password')))
        db.session.add(new_user)
        db.session.commit()
        return {
            'message': 'user registered successfully',
        }


class User(Resource):
    @pass_user
    def get(self, user):
        return {
            'data': {
                'username': user.get_response()['username'],
                'full_name': user.get_response()['full_name'],
                # 'organizations_ids': None,  # user['organizations_ids'],

            },
            'message': 'user found successfully',
        }
