"""
The views for login and register.
"""

import functools
import datetime as dt

from flask import Blueprint, render_template, request, redirect, url_for, flash, make_response
from werkzeug.security import generate_password_hash, check_password_hash

from .models import UserModel, db

bp = Blueprint('auth', __name__)


def login_required(view):
    """View decorator that redirects unregistered users to the login page."""

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        # XXX: If invalid token is present in cookie, it will still pass through
        # TODO: Validate token here.
        if 'token' not in request.cookies:
            flash('Please Log In to continue', category='message')
            return redirect(url_for('auth.login', then=request.path))
        return view(**kwargs)

    return wrapped_view


@bp.route('/login', methods=('GET', 'POST'))
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
            response.set_cookie('token', user.encode_auth_token(), expires=dt.datetime.now() + dt.timedelta(days=30), samesite='strict')
            return response

    return render_template('auth/login.html')


@bp.route('/register', methods=('GET', 'POST'))
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
                full_name=f'{first_name.strip()} {last_name.strip()}',
            )
            db.session.add(user)
            db.session.commit()

            route = request.form.get('then') or 'events'
            response = make_response(redirect(url_for('singlepage.index', route=route)))
            response.set_cookie('token', user.encode_auth_token(), expires=dt.datetime.now() + dt.timedelta(days=30), samesite='strict')
            return response

    return render_template('auth/register.html')
