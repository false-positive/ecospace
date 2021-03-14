import functools
from uuid import uuid4
import datetime as dt

from flask_restful import abort, Resource, reqparse

from ..models import EventModel, UserModel, db
from .auth import auth_token

event_form_parser = reqparse.RequestParser()
event_form_parser.add_argument('name', required=True)
event_form_parser.add_argument('location')
event_form_parser.add_argument('date', type=dt.datetime.fromisoformat)


def pass_event(view):
    """Decorator to pass a parameter to a view"""

    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        if 'event_id' in kwargs:
            event_id = kwargs.pop('event_id')
            event = EventModel.query.filter_by(public_id=event_id).first()
            print(event_id)
            if not event:
                abort(404, message=f'event with id {event_id} not found')
            kwargs['event'] = event
        return view(*args, **kwargs)

    return wrapped_view


class EventList(Resource):
    def get(self):
        events = EventModel.query.all()
        return {
            'data': {event.public_id: event.get_response() for event in events},
            'message': 'events listed successfully',
        }

    @auth_token
    def post(self, current_user):
        args = event_form_parser.parse_args()
        new_event = EventModel(
           public_id=str(uuid4()),
           organizer_id=current_user.id,
           name=args.get('name'),
           location=args.get('location'),
           date=args.get('date'),
        )
        participants = args.get('participants')
        if participants:
            for username in participants:
                user = UserModel.query.filter_by(username=username).first()
                if not user:
                    abort(404, f'user {user} not found')
                new_event.participants.append(user)
        db.session.add(new_event)
        db.session.commit()
        return {
            'data': {new_event.public_id: new_event.get_response()},
            'message': 'event created successfully',
        }


class EventManageUsers(Resource):
    @pass_event
    @auth_token
    def put(self, current_user, event):
        if event.organizer_id == current_user.id:
            abort(401, message='you are already in this event dum dum')
        current_user.events.append(event)
        db.session.commit()
        return {
            'data': current_user.get_response(),
            'message': 'successfully started event participation',
        }

    @pass_event
    @auth_token
    def delete(self, current_user, event):
        event.participants.remove(current_user)
        db.session.commit()
        return {
            'data': current_user.get_response(),
            'message': 'successfully removed event participation',
        }, 204


class Event(Resource):
    @pass_event
    def get(self, event):
        return {
            'data': event.get_response(),
            'message': 'event successfully found',
        }

    @pass_event
    @auth_token
    def put(self, current_user, event):
        if current_user.id != event.organizer_id:
            abort(403, message='you cannot do that')
        args = event_form_parser.parse_args()
        event.name = args.get('name') or event.name
        event.location = args.get('location') or event.location
        event.date = args.get('date') or event.date
        db.session.commit()
        return {
            'data': {event.id: event.get_response()},
            'message': 'edited event successfully',
        }

    @pass_event
    @auth_token
    def delete(self, current_user, event):
        db.session.delete(event)
        db.session.commit()
        return {
            'message': 'event successfully deleted',
        }, 204
