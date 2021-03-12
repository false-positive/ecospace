from flask_restful import Api, abort, Resource

api = Api

users = {
    '123e4567-e89b-12d3-a456-426614174000': {
        'username':  'test',
        'password': 'rozovi_rozi',
        'full_name': 'Joe',
        'organizations_ids': [],
    },
    '123e4568-e89b-12d3-a456-426614174000': {
        'username':  'test1',
        'password': 'rozovi_rozi',
        'full_name': 'Bob',
        'organizations_ids': [],
    },
    '123e4569-e89e-12d3-a456-426614174000': {
        'username':  'test2',
        'password': 'rozovi_rozi',
        'full_name': 'Ben',
        'organizations_ids': [],
    },
}

organizations = {
    '6a2ddadc-8327-11eb-8dcd-0242ac130003': {
        'name': 'Ecospace',
        'description': 'an api to the Ecospace project',
        'goal': 'lets finnish this api!',
        'owner': '123e4567-e89b-12d3-a456-426614174000',
        'admins': ['123e4568-e89b-12d3-a456-426614174000'],
        'members': [],
    }
}


class UserList(Resource):
    def get(self):
        result = []
        for id in users:
            result.append({
                'id': id,
                'username': users[id]['username'],
                'full_name': users[id]['full_name'],
                'organizations_ids': users[id]['organizations_ids'],
            })
        return {
            'data': result,
            'message': 'users listed successfully',
        }


class User(Resource):
    def get(self, handle):
        id = None
        for i in users:
            if handle == users[i]['username']:
                id = i
            if id is not None:
                break
        if id is None:
            abort(404, message=f'user with handle {handle} doesnt exist')
        return {
                'data': {
                    'id': id,
                    'username': users[id]['username'],
                    'full_name': users[id]['full_name'],
                    'organizations_ids': users[id]['organizations_ids'],

                },
                'message': 'user found successfully',
        }


class OrganizationList(Resource):
    def get(self):
        return {
            'data': organizations,
            'message': 'organizations listed successfully',
        }

class Organization(Resource):
    def get(self,handle):
        id = None
        for i in organizations:
            if handle == organizations[i]['name']:
                id = i
            if id is not None:
                break
        if id is None:
            abort(404, message=f'organization with handle {handle} doesnt exist')
        return {
            'data': organizations[id],
            'message': 'organization successfully found',
        }