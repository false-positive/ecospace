"""
The legacy frontend of ECOspace.
This is depricated and will be gone earlier than you think.
"""

from flask import Blueprint, render_template

bp = Blueprint('legacy', __name__)


@bp.route('/')
def index():
    return render_template('index.html')


@bp.route('/login')
def login():
    return render_template('login.html')


@bp.route('/register')
def register():
    return render_template('register.html')


@bp.route('/home')
def home():
    return render_template('home.html')


@bp.route('/going')
def going():
    return render_template('going.html')


@bp.route('/myevents')
def myevents():
    return render_template('myevents.html')


@bp.route('/profile')
def profile():
    return render_template('profile.html')


@bp.route('/createevent')
def createevent():
    return render_template('createevent.html')


@bp.route('/moreinfo')
def moreinfo():
    return render_template('moreinfo.html')
