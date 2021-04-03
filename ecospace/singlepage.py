"""
The single page frontend of ECOspace.
All routing is handled in the clientside
"""

from flask import Blueprint

bp = Blueprint(__name__, 'single_page')


@bp.route('/<path:route>')
def index(route):
    return route