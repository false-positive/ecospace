from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

events = db.Table(
    'events',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('event_id', db.Integer, db.ForeignKey('event.id'), primary_key=True),
)


class User(db.Model):
    # TODO: Add docstring
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True)
    full_name = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(80), nullable=False)
    # https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/#many-to-many-relationships
    events = db.relationship(
        'Event', secondary=events,
        lazy='subquery', backref=db.backref('users', lazy=True),
    )

    def get_response(self):
        return {
            'username': self.username,
            'full_name': self.full_name,
            # 'events': self.events,
        }

    def __str__(self):
        return f'<User @{self.username} ({self.public_id})>'


class Event(db.Model):
    # TODO: Add docstring
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True)
    name = db.Column(db.String(50), nullable=False)
    participants = db.relationship('User', secondary=events)

    def get_response(self):
        return {
            'name': self.name,
            'participants': None,  # TODO: Make this actually do the stuff
        }

    def __str__(self):
        return f'<Event {self.id}>'

