from flask_restful import abort, Resource

organizations = {
    '6a2ddadc-8327-11eb-8dcd-0242ac130003': {
        'name': 'ECOspace',
        'description': 'an api to the Ecospace project',
        'goal': 'lets finnish this api!',
        'owner': 'test1',
        'admins': ['test1'],
        'members': ['test', 'test2'],
    }
}


class OrganizationList(Resource):
    def get(self):
        return {
            'data': organizations,
            'message': 'organizations listed successfully',
        }


class Organization(Resource):
    def get(self, id):
        if id not in organizations:
            abort(404, message=f'organization with id {id} doesnt exist')
        return {
            'data': organizations[id],
            'message': 'organization successfully found',
        }

