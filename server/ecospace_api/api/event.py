import functools
from uuid import uuid4
from flask_restful import abort, Resource, reqparse
from ..models import EventModel, UserModel, db

event_form_parser = reqparse.RequestParser()
event_form_parser.add_argument('event_id')
event_form_parser.add_argument('name')
event_form_parser.add_argument('participants', action='append')
event_form_parser.add_argument('operation', type=str)


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
        results = {event.public_id: event.get_response() for event in events}
        return {
            'data': results,
            'message': 'events listed successfully',
        }

    def post(self):
        args = event_form_parser.parse_args()
        event_id = uuid4()
        name = args.get('name')
        participants = args.get('participants')
        list = []
        for username in participants:
            list.append(UserModel.query.filter_by(username=username).first())
        new_event = EventModel(id=None, public_id=str(event_id), name=name, participants=list)
        db.session.add(new_event)
        db.session.commit()
        return {
            'data': new_event.get_response(),
            'message': 'event created successfully',
        }

    def put(self):
        args = event_form_parser.parse_args()
        event_id = args.get('event_id')
        event = EventModel.query.filter_by(id=event_id).first()
        operation = args.get('operation')
        if event is None:
            abort(404, message=f'event with id{event_id} not found, maybe create one?')
        event.name = args.get('name') or event.name
        if args.get('participants') is not None:
            for username in args.get('participants'):
                if operation == 'add':
                    event.participants.append(UserModel.query.filter_by(username=username).first())
                elif operation == 'remove':
                    event.participants.remove(UserModel.query.filter_by(username=username).first())
                else:
                    print('>>>>>>>> Operation', operation)
                    abort(401, message=f'invalid {operation}operation')
        db.session.commit()
        return {
            'data': event.get_response(),
            'message': 'edited event successfully',
        }

    def delete(self):
        args = event_form_parser.parse_args()
        event_id = args.get('event_id')
        event = EventModel.query.filter_by(public_id=event_id).first()
        if event is None:
            abort(404, message=f'event with {event_id} doesnt exist')
        db.session.delete(event)
        db.session.commit()
        return {
            'message': 'event successfully deleted',
        }


class Event(Resource):
    @pass_event
    def get(self, event):
        return {
            'data': event.get_response(),
            'message': 'event successfully found',
        }
