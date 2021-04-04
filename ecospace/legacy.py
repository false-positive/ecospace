"""
The legacy frontend of ECOspace.
This is depricated and will be gone earlier than you think.
"""

from flask import Blueprint, render_template

from .auth import login_required

bp = Blueprint('legacy', __name__, url_prefix='/legacy')


@bp.route('/home')
@login_required
def home():
    return render_template('legacy/home.html')


@bp.route('/going')
@login_required
def going():
    return render_template('legacy/going.html')


@bp.route('/myevents')
@login_required
def myevents():
    return render_template('legacy/myevents.html')


@bp.route('/profile')
@login_required
def profile():
    return render_template('legacy/profile.html')


@bp.route('/createevent')
@login_required
def createevent():
    return render_template('legacy/createevent.html')


@bp.route('/moreinfo')
@login_required
def moreinfo():
    return render_template('legacy/moreinfo.html')
