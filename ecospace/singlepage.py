"""
The single page frontend of ECOspace.
All routing is handled in the clientside. See `ecospace/static/js/router.js`.
"""

from flask import Blueprint, render_template

from .auth import login_required

bp = Blueprint('singlepage', __name__)


@bp.route('/<path:route>')
@login_required
def index(route):
    return render_template('singlepage/index.html')
