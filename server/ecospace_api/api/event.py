
from flask_restful import abort, Resource

events = {
    '6a2ddadc-8327-11eb-8dcd-0242ac130003': {
        'name': 'ECOspace',
        'description': 'an api to the Ecospace project',
        'goal': 'lets finnish this api!',
        'owner': 'test1',
        'members': ['test', 'test2'],
    }
}


class EventList(Resource):
    def get(self):
        return {
            'data': events,
            'message': 'events listed successfully',
        }


class Event(Resource):
    def get(self, id):
        if id not in events:
            abort(404, message=f'event with id {id} doesnt exist')
        return {
            'data': events[id],
            'message': 'event successfully found',
        }