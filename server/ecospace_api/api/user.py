from flask_restful import abort, Resource

users = {
    'test': {
        'password': 'rozovi_rozi',
        'full_name': 'Joe',
        'organizations_ids': ['6a2ddadc-8327-11eb-8dcd-0242ac130003'],
    },
    'test1': {
        'password': 'rozovi_rozi',
        'full_name': 'Bob',
        'organizations_ids': ['6a2ddadc-8327-11eb-8dcd-0242ac130003'],
    },
    'test2': {
        'password': 'rozovi_rozi',
        'full_name': 'Ben',
        'organizations_ids': ['6a2ddadc-8327-11eb-8dcd-0242ac130003'],
    },
}


class UserList(Resource):
    def get(self):
        result = []
        for name in users:
            result.append({
                'username': name,
                'full_name': users[name]['full_name'],
                'organizations_ids': users[name]['organizations_ids'],
            })
        return {
            'data': result,
            'message': 'users listed successfully',
        }


class User(Resource):
    def get(self, username):
        if username not in users:
            abort(404, message=f'user with username {username} doesnt exist')
        user = users[username]
        return {
                'data': {
                    'username': username,
                    'full_name': user['full_name'],
                    'organizations_ids': user['organizations_ids'],

                },
                'message': 'user found successfully',
        }
