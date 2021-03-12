from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

organizations = db.Table(
    'organizations',
    db.Column('organisation_id', db.Integer, db.ForeignKey('organisation.id'), primary_key=True),  # noqa
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)   # noqa
)


class User(db.Model):
    # TODO: Add docstring
    id = db.Column(db.Integer, primary_key=True)
    handle = db.Column(db.String(15), unique=True)
    password = db.Column(db.String(80), nullable=False)
    # https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/#many-to-many-relationships
    organizations = db.relationship(
        'Organization', secondary=organizations,
        lazy='subquery', backref=db.backref('users', lazy=True),
    )

    def __str__(self):
        return f'<User: @{self.handle} ({self.public_id})>'


class Organization(db.Model):
    # TODO: Add docstring
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True)
    name = db.Column(db.String(50), nullable=False)

    def __str__(self):
        return f'<Organisation: {self.id}>'

