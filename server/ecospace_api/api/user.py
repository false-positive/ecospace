import functools
from werkzeug.security import generate_password_hash
from flask_restful import abort, Resource, reqparse
from ..models import UserModel, db, EventModel
from .auth import auth_token

user_form_parser = reqparse.RequestParser()
user_form_parser.add_argument('username', required=True)
user_form_parser.add_argument('full_name')
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
        events = EventModel.query.all()
        result = {}
        for user in users:
            list = {}
            response = user.get_response()
            username = response.pop('username')
            result[username] = {}
            result[username]['full_name'] = response
            for event in events:
                if user.username in event.get_response()['participants']:
                    id = event.get_response()['public_id']
                    list[id] = {}
                    list[id]['name'] = (event.get_response()['name'])
            result[username]['events'] = list
        return {
            'data': result,
            'message': 'users listed successfully',
        },

    def post(self):
        args = user_form_parser.parse_args()
        new_user = UserModel(id=None, username=args.get('username'), full_name=args.get('full_name'), password=generate_password_hash(args.get('password')))
        db.session.add(new_user)
        db.session.commit()
        return {
            'data': new_user.get_response(),
            'message': 'user registered successfully',
        }

    def put(self):
        args = user_form_parser.parse_args()
        username = args.get('username')
        user = UserModel.query.filter_by(username=username).first()
        if user is None:
            abort(404, f'user with username {username} doesnt exist')
        full_name = args.get('full_name') or user.full_name
        password = args.get('password') or user.password
        user.full_name = full_name
        user.password = generate_password_hash(password)
        db.session.commit()
        return {
            'data': user.get_response(),
            'message': 'edited successfully'
        }

    def delete(self):
        args = user_form_parser.parse_args()
        username = args.get('username')
        password = args.get('password')
        user = UserModel.query.filter_by(username=username).first()
        db.session.delete(user)
        db.session.commit()
        return {
            'message': 'user deleted successfully, did you really hated him that much?'
        },204

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
