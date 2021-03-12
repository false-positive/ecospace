import functools

from flask_restful import abort, Resource

from ..models import Event as EventModel


def pass_event(view):
    """Decorator to pass a parameter to a view"""

    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        if 'event_id' in kwargs:
            event_id = kwargs.pop('username')
            event = EventModel.query.filter_by(id=event_id).first()
            if not event:
                abort(404, f'event with id {id} not found')
            kwargs['event'] = event
        return view(*args, **kwargs)

    return wrapped_view


class EventList(Resource):
    def get(self):
        events = EventModel.query.all()
        results = {}
        for event in events:
            results[event.public_id] = event.get_response()
        return {
            'data': events,
            'message': 'events listed successfully',
        }


class Event(Resource):
    @pass_event
    def get(self, event):
        return {
            'data': event.get_response(),
            'message': 'event successfully found',
        }

