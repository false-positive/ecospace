"""
The views for login and register.
"""

import functools
import datetime as dt

import jwt
from flask import Blueprint, render_template, request, after_this_request, redirect, url_for, flash, make_response, g, current_app
from werkzeug.security import generate_password_hash, check_password_hash

from .models import UserModel, db

bp = Blueprint('auth', __name__)


def login_required(view):
    """View decorator that redirects unregistered users to the login page."""

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            flash('Please Log In to continue', category='message')
            return redirect(url_for('auth.login', then=request.path))
        return view(**kwargs)

    return wrapped_view


def logout_required(view):
    """View decorator that redirects registered users to the events page."""

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is not None:
            return redirect(url_for('singlepage.index', route='/events'))
        return view(**kwargs)

    return wrapped_view


@bp.before_app_request
def load_logged_in_user():
    try:
        # Get the user
        g.user = UserModel.decode_auth_token(request.cookies['token'])
    except KeyError:
        g.user = None
    except jwt.InvalidTokenError:
        g.user = None

        @after_this_request
        def remove_token_cookie(response):
            response.delete_cookie('token')
            return response


@bp.route('/login', methods=('GET', 'POST'))
@logout_required
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = UserModel.query.filter_by(username=username).first()

        if not user or not check_password_hash(user.password, password):
            flash('Invalid username or password')
        else:
            route = request.form.get('then') or 'events'
            response = make_response(redirect(url_for('singlepage.index', route=route)))
            response.set_cookie(
                'token', user.encode_auth_token(),
                expires=dt.datetime.now() + dt.timedelta(days=current_app.config['TOKEN_EXPIRE_DAYS']),
                samesite='strict',
            )
            return response

    return render_template('auth/login.html')


@bp.route('/register', methods=('GET', 'POST'))
@logout_required
def register():
    if request.method == 'POST':
        print(request.form)
        first_name = request.form['firstname']
        last_name = request.form['lastname']
        username = request.form['username']
        password = request.form['password']
        error = None

        if not first_name:
            error = 'First Name is required'
        elif not last_name:
            error = 'Second Name is required'
        elif not username:
            error = 'Username is required'
        elif not password:
            error = 'Password is required'
        elif UserModel.query.filter_by(username=username).first():
            error = f'Username {username} is already taken'

        if error:
            flash(error)
        else:
            user = UserModel(
                username=username,
                password=generate_password_hash(password),
                first_name=first_name.strip(),
                last_name=last_name.strip(),
            )
            db.session.add(user)
            db.session.commit()

            route = request.form.get('then') or 'events'
            response = make_response(redirect(url_for('singlepage.index', route=route)))
            response.set_cookie('token', user.encode_auth_token(), expires=dt.datetime.now() + dt.timedelta(days=30), samesite='strict')
            return response

    return render_template('auth/register.html')
