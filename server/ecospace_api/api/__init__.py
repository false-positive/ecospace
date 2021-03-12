from flask_restful import Api
from .user import UserList, User
from .organization import OrganizationList, Organization

api = Api()


api.add_resource(UserList, '/users')
api.add_resource(OrganizationList, '/organizations')
api.add_resource(User, '/users/<string:username>')
api.add_resource(Organization, '/organizations/<string:id>')