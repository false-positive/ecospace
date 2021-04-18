import functools

from flask_restful import abort, Resource, reqparse
from werkzeug.security import generate_password_hash

from ..models import UserModel, db
from .auth import auth_token

user_form_parser = reqparse.RequestParser()
user_form_parser.add_argument('username', required=True)
user_form_parser.add_argument('first_name')
user_form_parser.add_argument('last_name')
user_form_parser.add_argument('password', required=True)


user_edit_form_parser = reqparse.RequestParser()
user_edit_form_parser.add_argument('first_name', type=str)
user_edit_form_parser.add_argument('last_name', type=str)
user_edit_form_parser.add_argument('description', type=str)
user_edit_form_parser.add_argument('password', type=str)


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
        """Get a list of all users"""
        users = UserModel.query.all()
        return {
            'data': {user.username: user.get_response() for user in users},
            'message': 'users listed successfully',
        }


class User(Resource):
    @pass_user
    def get(self, user):
        """Get data about an existing user"""
        return {
            'data': user.get_response(),
            'message': 'user found successfully',
        }

    @pass_user
    @auth_token
    def put(self, user, current_user):
        """Edit an existing user"""
        if user.id != current_user.id:
            abort(403, message='cannot edit that user')

        args = user_edit_form_parser.parse_args()
        user.first_name = args.get('first_name') or user.first_name
        user.last_name = args.get('last_name') or user.last_name
        password = args.get('password')
        if password:
            user.password = generate_password_hash(password)
        user.description = args.get('description') or user.description
        db.session.commit()
        return {
            'data': {user.username: user.get_response()},
            'message': 'edited successfully'
        }

    @pass_user
    @auth_token
    def delete(self, user, current_user):
        """Delete an existing user"""
        if user.id != current_user.id:
            abort(403, message='cannot delete that user')
        db.session.delete(user)
        db.session.commit()
        return {
            'message': 'user deleted successfully, did you really hated him that much?'
        }, 204
