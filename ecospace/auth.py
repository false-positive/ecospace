"""
The views for login and register.
"""

import functools

from flask import Blueprint, render_template, request, redirect, url_for

bp = Blueprint('auth', __name__)


def login_required(view):
    """View decorator that redirects unregistered users to the login page."""

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        # XXX: If invalid token is present in cookie, it will still pass through
        # TODO: Validate token here.
        if not request.cookies.get('token'):
            return redirect(url_for('auth.login', then=request.path))
        return view(**kwargs)

    return wrapped_view


@bp.route('/login')
def login():
    return render_template('auth/login.html')


@bp.route('/register')
def register():
    return render_template('auth/register.html')
