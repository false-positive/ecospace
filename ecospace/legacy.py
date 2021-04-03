"""
The legacy frontend of ECOspace.
This is depricated and will be gone earlier than you think.
"""

from flask import Blueprint, render_template

bp = Blueprint('legacy', __name__)


@bp.route('/home')
def home():
    return render_template('legacy/home.html')


@bp.route('/going')
def going():
    return render_template('legacy/going.html')


@bp.route('/myevents')
def myevents():
    return render_template('legacy/myevents.html')


@bp.route('/profile')
def profile():
    return render_template('legacy/profile.html')


@bp.route('/createevent')
def createevent():
    return render_template('legacy/createevent.html')


@bp.route('/moreinfo')
def moreinfo():
    return render_template('legacy/moreinfo.html')
