import datetime as dt

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class UserModel(db.Model):
    """Database model for a registered user."""
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True)
    full_name = db.Column(db.String(50), unique=True)
    description = db.Column(db.String(250))
    password = db.Column(db.String(80), nullable=False)
    posts = db.relationship('EventModel', backref='organizer', lazy=True)

    def get_response(self):
        return {
            'full_name': self.full_name,
            'posts': None,
        }

    def __str__(self):
        return f'<User @{self.username} ({self.public_id})>'


class EventModel(db.Model):
    """Database model for an event, organized by a user, in which other users can participate."""
    __tablename__ = 'event'

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True)
    name = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    location = db.Column(db.String(50), nullable=True)  # TODO: Maybe store coords?
    organizer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

    def get_response(self):
        return {
            'name': self.name,
            'date': self.date.isoformat(),
            'location': self.location,
            'organizer': self.organizer_id,
        }

    def __str__(self):
        return f'<Event {self.id}>'

