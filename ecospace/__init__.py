import os
from contextlib import suppress
from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS

__version__ = '0.1.1'
__author__ = 'FalsePositive'


def generate_config(path):
    if os.path.exists(path):
        return

    with open(path, 'w') as file:
        content = f'''
            SECRET_KEY = {repr(os.urandom(25))[1:]}
        '''.strip()
        file.write(content)
        print('Created config file with secret key')


def create_app():
    """Create and configure an instance of a Flask app"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        # TODO: Configure linter to not complain about long lines
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{os.path.join(app.instance_path, "ecospace.sqlite")}',
    )

    CORS(app)

    with suppress(OSError):
        # Create the `ecospace/instance` folder where the db is
        os.makedirs(app.instance_path)

    generate_config(os.path.join(app.instance_path, 'config.cfg'))
    app.config.from_pyfile('config.cfg', silent=True)

    from .models import db, migrate
    db.init_app(app)
    migrate.init_app(app)

    @app.route('/')
    def landing():
        if not request.cookies.get('token'):
            return render_template('landing.html')
        else:
            return redirect(url_for('singlepage.index', route='events'))

    from . import api
    app.register_blueprint(api.bp)

    from . import auth
    app.register_blueprint(auth.bp)

    from . import legacy
    app.register_blueprint(legacy.bp)

    # This must be registered last, so it doesn't override anything
    from . import singlepage
    app.register_blueprint(singlepage.bp)

    return app
