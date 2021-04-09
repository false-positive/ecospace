"""
This module just calls setuptools.setup().
All the configuration is in `setup.cfg`
"""

from setuptools import setup

setup(
    # Requirements are here, so GitHub can find them
    install_requires=[
        "flask",
        'flask-restful',
        'Flask-SQLAlchemy',
        'flask-cors',
        'flask-migrate',
        'PyJWT',
    ]
)
