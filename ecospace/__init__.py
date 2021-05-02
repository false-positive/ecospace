import os
from contextlib import suppress

from flask import Flask, render_template, redirect, url_for
from flask_cors import CORS

__version__ = '0.2.0'
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
        TOKEN_EXPIRE_DAYS=30,
        UPLOAD_PATH=os.path.join(app.instance_path, 'usercontent'),
        UPLOAD_EXTENSIONS={'.jpg', '.png', '.gif'},  # TODO: Allow more image extensions
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{os.path.join(app.instance_path, "ecospace.sqlite")}',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    CORS(app)

    with suppress(OSError):
        # Create the `ecospace/instance` folder where the db is
        os.makedirs(app.instance_path)

    generate_config(os.path.join(app.instance_path, 'config.cfg'))
    app.config.from_pyfile('config.cfg', silent=True)

    from .models import db, migrate
    db.init_app(app)
    # https://blog.miguelgrinberg.com/post/fixing-alter-table-errors-with-flask-migrate-and-sqlite
    migrate.init_app(app, render_as_batch=True)

    from . import user_content
    app.register_blueprint(user_content.bp)

    @app.route('/favicon.ico')
    def favicon():
        return redirect(url_for('static', filename='img/logo.svg'))

    from . import api
    app.register_blueprint(api.bp)

    from . import auth
    app.register_blueprint(auth.bp)

    @app.route('/')
    @auth.logout_required
    def landing():
        return render_template('landing.html')

    # This must be registered last, so it doesn't override anything
    from . import singlepage
    app.register_blueprint(singlepage.bp)
    return app
