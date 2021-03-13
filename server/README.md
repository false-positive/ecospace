# The `ECOspace` Backend

This is the backend of the `ECOspace` social media platform.

## Installing

You will need Python 3.7 or later to install the package and its dependencies.

It is recommended that you install everything in a virtual environment, using:

```shell
$ python -m venv venv
$ . venv/bin/activate
(venv) $ pip install --editable .
```

## Running

```shell
(venv) $ export FLASK_APP=ecospace
(venv) $ export FLASK_ENV=development
(venv) $ flask run
```

## Basic API usage

From most endpoints, you can expect a json response, similar to this:
```json
{
  "data": "Mixed type containing the data",
  "message": "A message, explaining what happened e.g user registered successfully"
}
```
The `data` field may not be present if there's an error.

Users and events are accessed with request arguments.

An user's data looks like this:

```json
{
    "username": "test",
    "full_name": "testing",
    "events": {
      "d9de17d1-fc3e-497f-8586-c234058a767c": {
          "name": "another test 4 the api"
      }
    }
}
```

An event's data looks like this:

```json
{
    "public_id": "b03160df-d421-4de8-80d1-ada67cc45667",
    "name": "test2",
    "participants": [
        "test"
    ]
}
```

## Endpoints

### Users

#### `GET /users`

Get a list of all users

Status codes:
- `200 Ok` - everything went well

Example response:

```json
{
      "data": {
          "user2": {
              "full_name": "Full name",
              "events": {
                  "d9de17d1-fc3e-497f-8586-c234058a767c": {
                      "name": "another test 4 the api"
                  }
              }
          },
          "user3": {
              "full_name": "Foo Bar",
              "events": {
                  "b03160df-d421-4de8-80d1-ada67cc45667": {
                      "name": "test2"
                  },
                  "d9de17d1-fc3e-497f-8586-c234058a767c": {
                      "name": "another test 4 the api"
                  }
              }
          },
          "user4": {
              "full_name": "Sample text",
              "events": {}
          }
      },
      "message": "users listed successfully"
}
```

#### `GET /users/:username`

Get a certain user by his `username`

Status codes:
- `200 OK` - everything went well
- `404 Not Found` - a user with `username` doesn't exist

Example response:

```json
{
  "data": {
      "username": "test",
      "full_name": "testing",
      "events": {
        "d9de17d1-fc3e-497f-8586-c234058a767c": {
            "name": "another test 4 the api"
        }
      }
  },
  "message": "user found successfully"
}
```

#### `POST /users`

The POST request is used to register a new user.
Required arguments:
- `username`
- `full_name`
- `password`

Status codes:
- `201 Created` - the user was registered
- `401 Conflict` - a user with that username already exists 

Example response:

```json
{
  "data": {
      "username": "test",
      "full_name": "testing"
  },
  "message": "user registered successfully"
}
```

#### `PUT /users`

The PUT request is used to edit a user's information such as full name and password.

Required arguments:
- `username`
- `x-access-token`

Optional arguments:
- `full_name`
- `password`


Status codes:
- `201 Created` - the user was edited
- `401 Conflict` - a user with that username already exists 
- `403 Forbidden` - unathourized attempt at editing user

Example response:

```json
{
  "data": {
      "username": "test",
      "full_name": "testing"
  },
  "message": "user edited successfully"
}
```
#### `DELETE /users`

Delete a certain user.

Required arguments:
- `username`
- `x-access-token`

Status codes:
- `204 No Content` - the user was deleted successfully
- `403 Forbidden` - unathourized attempt at deleting user

### Events

#### `GET /events`

Get a list of all event

Status codes:
- `200 Ok` - everything went well

Example response:

```json
{
    "data": {
        "b03160df-d421-4de8-80d1-ada67cc45667": {
            "name": "test2",
            "participants": [
                "grisho"
            ]
        },
        "d9de17d1-fc3e-497f-8586-c234058a767c": {
            "name": "another test 4 the api",
            "participants": [
                "grisho2",
                "grisho"
            ]
        }
    },
    "message": "events listed successfully"
}
```

#### `GET /event/:public_id`

Get a certain event by its `public_id`

Status codes:
- `200 OK` - everything went well
- `404 Not Found` - a event with `public_id` doesn't exist

Example response:

```json
{
  "data": {
          "public_id": "b03160df-d421-4de8-80d1-ada67cc45667",
          "name": "test2",
          "participants": [
              "grisho"
          ]
      },
      "message": "event found successfully"
}
```

#### `POST /users`

The POST request is used to register a new event.
Required arguments:
- `name`
- `participants`

Status codes:
- `201 Created` - the event was registered

Example response:

```json
{
  "data": {
      "name": "testing 2:electric boogaloo",
      "public_id": "c0a2b040-8990-4aeb-bb20-b5c00efab393",
      "participants": [
          "grisho"
      ]
  },
  "message": "event created successfully"
}
```

#### `PUT /users`

The PUT request is used to edit an event's information such as name and its participants.

Required arguments:
- `public_id`
- `x-access-token`

Optional arguments:
- `name`
- `participants`


Status codes:
- `201 Created` - the event was edited
- `401 Conflict` - a user with that that username is already added 
- `403 Forbidden` - unathourized attempt at editing event

Example response:

```json
}
    "data": {
        "public_id": "c0a2b040-8990-4aeb-bb20-b5c00efab393",
        "name": "testing 2:electric boogaloo",
        "participants": [
            "grisho",
            "grisho2"
        ]
    },
    "message": "edited event successfully"
}

```
#### `DELETE /event`

Delete a certain event.

Required arguments:
- `public_id`
- `x-access-token`

Status codes:
- `204 No Content` - the event was deleted successfully
- `403 Forbidden` - unathourized attempt at deleting event

### Authentication

#### `GET /login`

Login to selected account with `username` and `password`. After the login it returns a `x-access-token`.

Example response:

```json
{
  "data": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImdyaXNobyIsImV4cCI6MTYxNTY0Njk4OH0.sHpYjTukwcVzpMZGFovALLrOYhGRi6hRCWpdedc7A88",
  "message": "successfully logged"

}
```
The `data` returned is the `x-access-token`

<!-- TODO: Document more stuff -->

