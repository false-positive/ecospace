from flask import Blueprint
from flask_restful import Api

from .user import UserList, User
from .event import EventList, Event, EventManageUsers
from .auth import AuthResource
from .comment import CommentList, Comment

api = Api()

api.add_resource(UserList, '/users')
api.add_resource(EventList, '/events')
api.add_resource(User, '/users/<string:username>')
api.add_resource(Event, '/events/<string:event_id>')
api.add_resource(EventManageUsers, '/events/<string:event_id>/users')
api.add_resource(AuthResource, '/auth')
api.add_resource(CommentList, '/events/<string:event_id>/comments')
api.add_resource(Comment, '/events/<string:event_id>/comments/<string:comment_id>')

bp = Blueprint('api', __name__, url_prefix='/api')
api.init_app(bp)
