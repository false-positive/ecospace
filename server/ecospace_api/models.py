from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    # TODO: Add docstring
    id = db.Column(db.Integer, primary_key=True)
    handle = db.Column(db.String(15), unique=True)
    password = db.Column(db.String(80), nullable=False)

    def __str__(self):
        return f'<User: @{self.handle} ({self.public_id})>'

