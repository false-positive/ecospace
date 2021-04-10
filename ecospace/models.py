import datetime as dt

import jwt
from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate(db=db)

events = db.Table(
    'events',
    db.Column('event_id', db.Integer, db.ForeignKey('event.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)

comments = db.Table(
    'comments',
    db.Column('comment_id', db.Integer, db.ForeignKey('comment.id'), primary_key=True),
    db.Column('event_id', db.Integer, db.ForeignKey('event.id'), primary_key=True)
)

class UserModel(db.Model):
    """Database model for a registered user."""
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True)
    full_name = db.Column(db.String(50))  # TODO: Get `username` by default
    description = db.Column(db.String(250), default='', nullable=False)
    password = db.Column(db.String(80), nullable=False)
    organized_events = db.relationship('EventModel', backref='organizer', lazy=True)
    comments = db.relationship('CommentModel', backref='author', lazy=True)
    # https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/#many-to-many-relationships
    events = db.relationship('EventModel', secondary=events, lazy='subquery', backref=db.backref('participants', lazy=True))

    def encode_auth_token(self):
        token = jwt.encode({
            'username': self.username,
            'exp': dt.datetime.utcnow() + dt.timedelta(days=30),
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        return token

    @classmethod
    def decode_auth_token(cls, token):
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        user = cls.query.filter_by(username=payload['username']).first()
        return user

    def get_response(self):
        return {
            'username': self.username,
            'full_name': self.full_name,
            'description': self.description,
            'organized_events': {event.public_id: event.get_response() for event in self.organized_events},
            'events': {event.public_id: event.get_response() for event in self.events},
        }

    def __str__(self):
        return f'<User @{self.username}>'


class EventModel(db.Model):
    """Database model for an event, organized by a user, in which other users can participate."""
    __tablename__ = 'event'

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True)
    name = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    description = db.Column(db.String(), nullable=False, default='')
    location = db.Column(db.String(50), nullable=True)  # TODO: Maybe store coords?
    organizer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    comments = db.relationship('CommentModel', secondary=comments, lazy='subquery', backref=db.backref('event', lazy=True))

    def get_response(self):
        return {
            'name': self.name,
            'date': self.date.isoformat(),
            'description': self.description,
            'location': self.location,
            'organizer_username': self.organizer.username,
            'participants': [participant.username for participant in self.participants],
            'comments': [comment.get_response() for comment in self.comments]
        }

    def __str__(self):
        return f'<Event {self.id}>'

class CommentModel(db.Model):
    __tablename__ = 'comment'

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True)
    date = db.Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    content = db.Column(db.String(500), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=True)
    child_comments = db.relationship('CommentModel', backref=db.backref('parent_comment', remote_side=[id]), lazy='dynamic')

    def get_response(self):
        return {
            'public_id': self.public_id,
            'date': self.date.isoformat(),
            'content': self.content,
            'author': self.author.username,
            'child_comments': [child_comment.get_response() for child_comment in self.child_comments]
        }

    def __str__(self):
        return  f'<Comment {self.id}>'
