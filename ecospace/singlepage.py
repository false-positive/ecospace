"""
The single page frontend of ECOspace.
All routing is handled in the clientside
"""

from flask import Blueprint, render_template

bp = Blueprint(__name__, 'single_page')


@bp.route('/<path:route>')
def index(route):
    return render_template('singlepage/index.html')