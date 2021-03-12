import functools

from flask_restful import abort, Resource

from ..models import User as UserModel  # TODO: Maybe rename the models to prevent collisions like this


def pass_user(view):
    """Decorator to pass a user a a parameter to a view"""

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
            result[response['username']] = {}
            result[response['username']]['full_name'] = response['full_name']
        return {
            'data': result,
            'message': 'users listed successfully',
        },


class User(Resource):
    @pass_user
    def get(self, user):
        return {
            'data': {
                'username': user.username,
                'full_name': user.full_name,
                # 'organizations_ids': None,  # user['organizations_ids'],

            },
            'message': 'user found successfully',
        }
