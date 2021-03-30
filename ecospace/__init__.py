import os
from contextlib import suppress
from flask import Flask, jsonify
from flask_cors import CORS

__version__ = '0.1.0'
__author__ = 'FalsePositive'


def create_app():
    """Create and configure an instance of a Flask app"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
            # TODO: Configure linter to not complaina about long lines
            SQLALCHEMY_DATABASE_URI=f'sqlite:///{os.path.join(app.instance_path, "ecospace.sqlite")}',
    )

    app.config.from_pyfile('config.cfg', silent=True)

    CORS(app)

    with suppress(OSError):
        # Create the `scifedium/server/instance` folder where the db is
        os.makedirs(app.instance_path)

    from .models import db
    db.init_app(app)

    from . import api
    app.register_blueprint(api.bp)

    from . import legacy
    app.register_blueprint(legacy.bp)

    return app
