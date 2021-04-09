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

Next you need to configure the flask environment

```shell
(venv) $ export FLASK_APP=ecospace
(venv) $ export FLASK_ENV=development
```

And finally, setup the database and apply all migrations using

```shell
(venv) $ flask db upgrade
```

If all goes well, you can move on to [the next section](#Running).

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
    "full_name": "grisho the og one",
    "description": "",
    "organized_events": {
        "fca3aaac-c9cd-4da5-be80-fabd5c5a4794": {
            "name": "test",
            "date": "2021-03-13T00:00:00",
            "location": "sofia",
            "organizer_username": "grisho"
        }
    },
    "events": {}
}
```

An event's data looks like this:

```json
{
    "name": "test2",
    "date": "2021-03-13T00:00:00",
    "location": "sofia",
    "organizer_username": "grisho2"
}
```

## Endpoints

### Users

#### `GET /users`

Get a list of all users

Status codes:

-   `200 Ok` - everything went well

Example response:

```json
{
    "data": {
        "grisho": {
            "full_name": "grisho the og one",
            "description": "",
            "organized_events": {
                "fca3aaac-c9cd-4da5-be80-fabd5c5a4794": {
                    "name": "test",
                    "date": "2021-03-13T00:00:00",
                    "location": "sofia",
                    "organizer_username": "grisho"
                }
            },
            "events": {}
        },
        "grisho2": {
            "full_name": "grisho #2",
            "description": "",
            "organized_events": {},
            "events": {}
        }
    },
    "message": "users listed successfully"
}
```

#### `GET /users/:username`

Get a certain user by his `username`

Status codes:

-   `200 OK` - everything went well
-   `404 Not Found` - a user with `username` doesn't exist

Example response:

```json
{
    "data": {
        "full_name": "grisho the og one",
        "description": "",
        "organized_events": {
            "fca3aaac-c9cd-4da5-be80-fabd5c5a4794": {
                "name": "test",
                "date": "2021-03-13T00:00:00",
                "location": "sofia",
                "organizer_username": "grisho"
            }
        },
        "events": {}
    },
    "message": "user found successfully"
}
```

#### `PUT /users`

The PUT request is used to edit a user's information such as full name and password.

Required arguments:

-   `username`
-   `x-access-token`

Optional arguments:

-   `full_name`
-   `password`
-   `description`

Status codes:

-   `201 Created` - the user was edited
-   `401 Conflict` - a user with that username already exists
-   `403 Forbidden` - unathourized attempt at editing user

Example response:

```json
 "data": {
        "grisho2": {
            "full_name": "grisho #2",
            "description": "time to finish that documentation(not tommorow)",
            "organized_events": {},
            "events": {}
        }
    },
 "message": "edited successfully"

```

#### `DELETE /users`

Delete a certain user.

Required arguments:

-   `username`
-   `x-access-token`

Status codes:

-   `204 No Content` - the user was deleted successfully
-   `403 Forbidden` - unathourized attempt at deleting user

### Events

#### `GET /events`

Get a list of all event

Status codes:

-   `200 Ok` - everything went well

Example response:

```json
{
    "data": {
        "fca3aaac-c9cd-4da5-be80-fabd5c5a4794": {
            "name": "test",
            "date": "2021-03-13T00:00:00",
            "location": "sofia",
            "organizer_username": "grisho"
        },
        "b6f6af57-8742-4acd-b1fd-5cc881c109be": {
            "name": "test2",
            "date": "2021-03-13T00:00:00",
            "location": "sofia",
            "organizer_username": "grisho2"
        }
    },
    "message": "events listed successfully"
}
```

#### `GET /event/:public_id`

Get a certain event by its `public_id`

Status codes:

-   `200 OK` - everything went well
-   `404 Not Found` - a event with `public_id` doesn't exist

Example response:

```json
{
    "data": {
        "name": "test2",
        "date": "2021-03-13T00:00:00",
        "location": "sofia",
        "organizer_username": "grisho2"
    },
    "message": "event successfully found"
}
```

#### `POST /event`

The POST request is used to register a new event.
Required arguments:

-   `name`
-   `participants`
-   `location`
-   `date`

Status codes:

-   `201 Created` - the event was registered
-   `403 Forbidden` - can't create an event without an account
    Example response:

```json
{
    "data": {
        "name": "testing 2:electric boogaloo",
        "public_id": "c0a2b040-8990-4aeb-bb20-b5c00efab393",
        "participants": ["grisho"]
    },
    "message": "event created successfully"
}
```

#### `PUT /event`

The PUT request is used to edit an event's information such as name and its participants.

Required arguments:

-   `public_id`
-   `x-access-token`

Optional arguments:

-   `name`
-   `participants`
-   `location`
-   `date`

Status codes:

-   `201 Created` - the event was edited
-   `401 Conflict` - a user with that that username is already added
-   `403 Forbidden` - unathourized attempt at editing event

Example response:

```json
{
    "data": {
        "name": "test2",
        "date": "2021-03-14T00:00:00",
        "location": "sofia",
        "organizer_username": "grisho2"
    },
    "message": "edited event successfully"
}
```

#### `PUT /events/event_id/users`

Add the current user to the event.

Example response:

```json
{
    "data": {
        "full_name": "grisho bot",
        "description": "",
        "organized_events": {},
        "events": {
            "2bbd34e6-9e13-4a63-a4b9-7ef235ce5efe": {
                "name": "testing comments",
                "date": "2021-03-14T01:28:46.330184",
                "location": "here",
                "organizer_username": "grisho#10",
                "comments": {}
            }
        }
    },
    "message": "successfully started event participation"
}
```

#### `DELETE /events/event_id/users`

Remove the current user from the event

Example response:

```json
{
    "data": {
        "full_name": "grisho bot",
        "description": "",
        "organized_events": {},
        "events": {}
    },
    "message": "successfully removed event participation"
}

}
```

#### `DELETE /event`

Delete a certain event.

Required arguments:

-   `public_id`
-   `x-access-token`

Status codes:

-   `204 No Content` - the event was deleted successfully
-   `403 Forbidden` - unathourized attempt at deleting event

### Authentication

#### `GET /auth`

Login to selected account with `username` and `password`. After the login it returns a `x-access-token`.

Example response:

```json
{
    "data": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImdyaXNobyIsImV4cCI6MTYxNTY0Njk4OH0.sHpYjTukwcVzpMZGFovALLrOYhGRi6hRCWpdedc7A88",
    "message": "successfully logged"
}
```

The `data` returned is the `x-access-token`

#### `POST /auth`

The POST request is used to register a new user.
Required arguments:

-   `username`
-   `full_name`
-   `password`

Optional arguments:

-   `description`

Status codes:

-   `201 Created` - the user was registered
-   `401 Conflict` - a user with that username already exists

Example response:

```json
{
    "data": {
        "grisho2": {
            "full_name": "grisho #2",
            "description": "",
            "organized_events": {}
        }
    },
    "message": "user registered successfully"
}
```

<!-- TODO: Document even more stuff -->
