from flask_restful import Api

from .user import UserList, User
from .event import EventList, Event, EventManageUsers
from .auth import AuthResource

api = Api()


api.add_resource(UserList, '/users')
api.add_resource(EventList, '/events')
api.add_resource(User, '/users/<string:username>')
api.add_resource(Event, '/events/<string:event_id>')
api.add_resource(EventManageUsers, '/events/<string:event_id>/users')
api.add_resource(AuthResource, '/auth')
