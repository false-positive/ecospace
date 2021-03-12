from flask import Flask, jsonify

__version__ = '0.0.1'
# __author__ = 'FalsePositive'


def create_app():
    """Create and configure an instance of a Flask app"""
    app = Flask(__name__)

    @app.route('/flask_test')
    def hello():
        return jsonify({'message': 'flask seems to work, congrats!'})

    return app

