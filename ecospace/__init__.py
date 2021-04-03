import os
from contextlib import suppress
from flask import Flask, jsonify, render_template
from flask_cors import CORS

__version__ = '0.1.0'
__author__ = 'FalsePositive'


def create_app():
    """Create and configure an instance of a Flask app"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
            # TODO: Configure linter to not complain about long lines
            SQLALCHEMY_DATABASE_URI=f'sqlite:///{os.path.join(app.instance_path, "ecospace.sqlite")}',
    )

    app.config.from_pyfile('config.cfg', silent=True)

    CORS(app)

    with suppress(OSError):
        # Create the `ecospace/instance` folder where the db is
        os.makedirs(app.instance_path)

    from .models import db
    db.init_app(app)

    @app.route('/')
    def landing():
        return render_template('landing.html')

    from . import api
    app.register_blueprint(api.bp)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import legacy
    app.register_blueprint(legacy.bp)

    return app
