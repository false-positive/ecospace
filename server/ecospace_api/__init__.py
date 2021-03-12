import os
from contextlib import suppress

from flask import Flask, jsonify

__version__ = '0.0.1'
__author__ = 'FalsePositive'


def create_app():
    """Create and configure an instance of a Flask app"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
            # TODO: Configure linter to not complaina about long lines
            SQLALCHEMY_DATABASE_URI=f'sqlite://{os.path.join(app.instance_path, "ecospace.sqlite")}',  # noqa
    )

    with suppress(OSError):
        # Create the `scifedium/server/instance` folder where the db is
        os.makedirs(app.instance_path)

    from .models import db
    db.init_app(app)

    @app.route('/flask_test')
    def hello():
        return jsonify({'message': 'flask seems to work, congrats!'})

    from .api import api
    api.init_app(app)

    return app


