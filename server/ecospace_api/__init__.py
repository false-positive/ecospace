from flask import Flask, jsonify
from flask_restful import Api
__version__ = '0.0.1'
# __author__ = 'FalsePositive'

def create_app():
    """Create and configure an instance of a Flask app"""
    app = Flask(__name__)

    @app.route('/flask_test')
    def hello():
        return jsonify({'message': 'flask seems to work, congrats!'})

    from .api import  User, UserList,Organization ,OrganizationList

    api = Api(app)
    api.init_app(app)
    api.add_resource(UserList, '/users')
    api.add_resource(OrganizationList, '/organizations')
    api.add_resource(User, '/users/<string:handle>')
    api.add_resource(Organization, '/organizations/<string:handle>')

    return app


