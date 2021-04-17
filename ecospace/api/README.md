# The `ECOspace` Backend

This is the backend of the `ECOspace` social media platform.

## Installing

You will need Python 3.7 or later to install the package and its dependencies.

It is recommended that you install everything in a virtual environment, using:

### Linux

```shell
$ python -m venv venv
$ . venv/bin/activate
(venv) $ pip install --editable .
```

```shell
(venv) $ export FLASK_APP=ecospace
(venv) $ export FLASK_ENV=development
```

```shell
(venv) $ flask db upgrade
```

### Windows

```shell
python -m venv venv
.\venv\Scripts\activate.bat
(venv) pip install --editable .
```

```shell
(venv) set FLASK_APP=ecospace
(venv) set FLASK_ENV=development
```

```shell
(venv) flask db upgrade
```

If all goes well, you can move on to [the next section](#Running).

## Running

### Linux

```shell
(venv) $ export FLASK_APP=ecospace
(venv) $ export FLASK_ENV=development
(venv) $ flask run
```

### Windows

```shell
(venv) set FLASK_APP=ecospace
(venv) set FLASK_ENV=development
(venv) flask run
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
    "data": {
        "username": "asdf",
        "full_name": "aeasfd sdfasdf",
        "description": "",
        "avatar_url": "/static/img/icak.jpg",
        "organized_events": {},
        "events": {}
    },
    "message": "user found successfully"
}
```

An event's data looks like this:

```json
{
    "data": {
        "name": "test",
        "date": "2021-04-20T00:00:00",
        "description": "test",
        "location": "42.69593648936457 23.32225551494975",
        "organizer_username": "test",
        "participants": [
            "yes"
        ],
        "comments": [
            {
                "public_id": "4cc90b90-142f-408a-a62d-8ab4309fc9d4",
                "date": "2021-04-13T16:20:27.136154",
                "content": "F O O",
                "author": "yes",
                "child_comments": []
            },
            {
                "public_id": "b7b423a7-a617-4627-8275-87749115b046",
                "date": "2021-04-14T14:13:58.858937",
                "content": "B A R",
                "author": "asdf",
                "child_comments": []
            }
        ]
    },
    "message": "event successfully found"
}
```

## Endpoints

### Users

#### `GET api/users`

Get a list of all users

Status codes:

-   `200 Ok` - everything went well

Example response:

```json
{
    "data": {
        "test": {
            "username": "test",
            "full_name": "test testov",
            "description": "",
            "avatar_url": "/static/img/icak.jpg",
            "organized_events": {
                "4f9b6f0d-f944-4afe-91a6-ecab402e3eaa": {
                    "name": "test",
                    "date": "2021-04-20T00:00:00",
                    "description": "test",
                    "location": "42.69593648936457 23.32225551494975",
                    "organizer_username": "test",
                    "participants": [
                        "yes"
                    ],
                    "comments": [
                        {
                            "public_id": "4cc90b90-142f-408a-a62d-8ab4309fc9d4",
                            "date": "2021-04-13T16:20:27.136154",
                            "content": "F O O",
                            "author": "yes",
                            "child_comments": []
                        },
                        {
                            "public_id": "b7b423a7-a617-4627-8275-87749115b046",
                            "date": "2021-04-14T14:13:58.858937",
                            "content": "B A R",
                            "author": "asdf",
                            "child_comments": []
                        }
                    ]
                }
            },
            "events": {}
        },
        "yes": {
            "username": "yes",
            "full_name": "testing comments & things",
            "description": "",
            "avatar_url": "/static/img/icak.jpg",
            "organized_events": {
                "7814afe3-c533-45b4-8420-b10c0469a5af": {
                    "name": "yes",
                    "date": "2021-04-22T00:00:00",
                    "description": "an event",
                    "location": "42.684959189788664 23.31522109692683",
                    "organizer_username": "yes",
                    "participants": [],
                    "comments": []
                }
            },
            "events": {
                "4f9b6f0d-f944-4afe-91a6-ecab402e3eaa": {
                    "name": "test",
                    "date": "2021-04-20T00:00:00",
                    "description": "test",
                    "location": "42.69593648936457 23.32225551494975",
                    "organizer_username": "test",
                    "participants": [
                        "yes"
                    ],
                    "comments": [
                        {
                            "public_id": "4cc90b90-142f-408a-a62d-8ab4309fc9d4",
                            "date": "2021-04-13T16:20:27.136154",
                            "content": "F O O",
                            "author": "yes",
                            "child_comments": []
                        },
                        {
                            "public_id": "b7b423a7-a617-4627-8275-87749115b046",
                            "date": "2021-04-14T14:13:58.858937",
                            "content": "B A R",
                            "author": "asdf",
                            "child_comments": []
                        }
                    ]
                }
            }
        },
        "asdf": {
            "username": "asdf",
            "full_name": "aeasfd sdfasdf",
            "description": "",
            "avatar_url": "/static/img/icak.jpg",
            "organized_events": {
                "d5b2a41d-5d0e-48a0-ad18-d42572cad2ae": {
                    "name": "sample event",
                    "date": "2021-04-23T00:00:00",
                    "description": "sample text",
                    "location": "42.69126821974304 23.323971226662657",
                    "organizer_username": "asdf",
                    "participants": [],
                    "comments": []
                }
            },
            "events": {}
        }
    },
    "message": "users listed successfully"
}
```

#### `GET api/users/:username`

Get a certain user by his `username`

Status codes:

-   `200 OK` - everything went well
-   `404 Not Found` - a user with `username` doesn't exist

Example response:

```json
{
    "data": {
        "username": "asdf",
        "full_name": "aeasfd sdfasdf",
        "description": "",
        "avatar_url": "/static/img/icak.jpg",
        "organized_events": {},
        "events": {}
    },
    "message": "user found successfully"
}
```

#### `PUT api/users`

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
 {
    "data": {
        "username": "asdf",
        "full_name": "aeasfd sdfasdf",
        "description": "",
        "avatar_url": "/static/img/icak.jpg",
        "organized_events": {},
        "events": {}
    },
    "message": "user edited successfully"
}
```

#### `DELETE api/users`

Delete a certain user.

Required arguments:

-   `username`
-   `x-access-token`

Status codes:

-   `204 No Content` - the user was deleted successfully
-   `403 Forbidden` - unathourized attempt at deleting user

### Events

#### `GET api/events`

Get a list of all event

Status codes:

-   `200 Ok` - everything went well

Example response:

```json
{
    "data": {
        "4f9b6f0d-f944-4afe-91a6-ecab402e3eaa": {
            "name": "test",
            "date": "2021-04-20T00:00:00",
            "description": "test",
            "location": "42.69593648936457 23.32225551494975",
            "organizer_username": "test",
            "participants": [
                "yes"
            ],
            "comments": [
                {
                    "public_id": "4cc90b90-142f-408a-a62d-8ab4309fc9d4",
                    "date": "2021-04-13T16:20:27.136154",
                    "content": "F O O",
                    "author": "yes",
                    "child_comments": []
                },
                {
                    "public_id": "b7b423a7-a617-4627-8275-87749115b046",
                    "date": "2021-04-14T14:13:58.858937",
                    "content": "B A R",
                    "author": "asdf",
                    "child_comments": []
                }
            ]
        },
        "7814afe3-c533-45b4-8420-b10c0469a5af": {
            "name": "yes",
            "date": "2021-04-22T00:00:00",
            "description": "event",
            "location": "42.684959189788664 23.31522109692683",
            "organizer_username": "yes",
            "participants": [],
            "comments": [
                {
                    "public_id": "714caaf7-bb38-403f-bbf0-c1fa81f420b6",
                    "date": "2021-04-13T16:12:07.555857",
                    "content": "testing",
                    "author": "yes",
                    "child_comments": []
                }
            ]
        },
        "d5b2a41d-5d0e-48a0-ad18-d42572cad2ae": {
            "name": "sample event",
            "date": "2021-04-23T00:00:00",
            "description": "sample text",
            "location": "42.69126821974304 23.323971226662657",
            "organizer_username": "asdf",
            "participants": [],
            "comments": []
        }
    },
    "message": "events listed successfully"
}
```

#### `GET api/events/:public_id`

Get a certain event by its `public_id`

Status codes:

-   `200 OK` - everything went well
-   `404 Not Found` - a event with `public_id` doesn't exist

Example response:

```json
{
    "data": {
        "name": "yes",
        "date": "2021-04-22T00:00:00",
        "description": "event",
        "location": "42.684959189788664 23.31522109692683",
        "organizer_username": "yes",
        "participants": [],
        "comments": [
            {
                "public_id": "714caaf7-bb38-403f-bbf0-c1fa81f420b6",
                "date": "2021-04-13T16:12:07.555857",
                "content": "testing",
                "author": "yes",
                "child_comments": []
            }
        ]
    },
    "message": "event successfully found"
}
```

#### `POST api/events`

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
        "name": "sample event",
        "date": "2021-04-23T00:00:00",
        "description": "sample text",
        "location": "42.69126821974304 23.323971226662657",
        "organizer_username": "asdf",
        "participants": [],
        "comments": []
    },
    "message": "event created successfully"
}
```

#### `PUT api/events/:public_id`

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
        "name": "sample event",
        "date": "2021-04-23T00:00:00",
        "description": "sample text",
        "location": "42.69126821974304 23.323971226662657",
        "organizer_username": "asdf",
        "participants": [],
        "comments": []
    },
    "message": "event edited successfully"
}
```

#### `PUT /events/:event_id/users`

Add the current user to the event.

Example response:

```json
{
    "data": {
        "username": "asdf",
        "full_name": "aeasfd sdfasdf",
        "description": "",
        "avatar_url": "/static/img/icak.jpg",
        "organized_events": {
            "d5b2a41d-5d0e-48a0-ad18-d42572cad2ae": {
                "name": "sample event",
                "date": "2021-04-23T00:00:00",
                "description": "sample text",
                "location": "42.69126821974304 23.323971226662657",
                "organizer_username": "asdf",
                "participants": [],
                "comments": []
            }
        },
        "events": {
            "4f9b6f0d-f944-4afe-91a6-ecab402e3eaa": {
                "name": "test",
                "date": "2021-04-20T00:00:00",
                "description": "test",
                "location": "42.69593648936457 23.32225551494975",
                "organizer_username": "test",
                "participants": [
                    "yes",
                    "asdf"
                ],
                "comments": [
                    {
                        "public_id": "4cc90b90-142f-408a-a62d-8ab4309fc9d4",
                        "date": "2021-04-13T16:20:27.136154",
                        "content": "F O O",
                        "author": "yes",
                        "child_comments": []
                    },
                    {
                        "public_id": "b7b423a7-a617-4627-8275-87749115b046",
                        "date": "2021-04-14T14:13:58.858937",
                        "content": "B A R",
                        "author": "asdf",
                        "child_comments": []
                    }
                ]
            }
        }
    },
    "message": "succsessfully started event participation"
}
```

#### `DELETE /events/:event_id/users`

Remove the current user from the event

Example response:

```json
{
    "data": {
        "username": "asdf",
        "full_name": "aeasfd sdfasdf",
        "description": "",
        "avatar_url": "/static/img/icak.jpg",
        "organized_events": {
            "d5b2a41d-5d0e-48a0-ad18-d42572cad2ae": {
                "name": "sample event",
                "date": "2021-04-23T00:00:00",
                "description": "sample text",
                "location": "42.69126821974304 23.323971226662657",
                "organizer_username": "asdf",
                "participants": [],
                "comments": []
            }
        },
        "events": {}
    },
    "message": "successfully stopped event participation"
}
```

#### `DELETE api/events/:event_id`

Delete a certain event.

Required arguments:

-   `public_id`
-   `x-access-token`

Status codes:

-   `204 No Content` - the event was deleted successfully
-   `403 Forbidden` - unathourized attempt at deleting event

### Comments

#### `GET api/events/:event_id/comments`

Get a list of all comments on event with event_id

Example response:

```json
{
    "data": [
        {
            "public_id": "cc297dee-eb11-4b01-9c89-6f4f8cef1f39",
            "date": "2021-04-17T08:31:13.416252",
            "content": "testing comments\r\n",
            "author": "asdf",
            "child_comments": []
        },
        {
            "public_id": "730e4582-450d-4535-b47c-6bf2e31c8ee2",
            "date": "2021-04-17T08:31:20.501292",
            "content": "testing comments even more",
            "author": "asdf",
            "child_comments": []
        },
        {
            "public_id": "0246ccd5-5b7d-42e0-97cb-9096c930c28c",
            "date": "2021-04-17T08:31:25.467035",
            "content": "and more",
            "author": "asdf",
            "child_comments": []
        }
    ],
    "message": "comments listed successfully"
}
```

#### `GET api/events/:event_id/comments/:comment_id`

Get a comment with comment_id and its child comments 

Example response:
```json
{
    "data": {
        "public_id": "cc297dee-eb11-4b01-9c89-6f4f8cef1f39",
        "date": "2021-04-17T08:31:13.416252",
        "content": "testing comments\r\n",
        "author": "asdf",
        "child_comments": []
    },
    "message": "comment successfully found"
}

```

#### `POST api/events/:event_id/comments/new`

Create a new comment under event with event_id
Required arguments:

- `content`
- `x-access-token`

Status codes:

-   `201 Created` - the comment was created

Example response:

```json
{
    "data": {
        "d22f0085-ff69-4e86-abd4-6498c20cd545": {
            "public_id": "d22f0085-ff69-4e86-abd4-6498c20cd545",
            "date": "2021-04-17T08:09:41.670102",
            "content": "test",
            "author": "asdf",
            "child_comments": []
        }
    },
    "message": "comment successfully posted"
}
```

#### Currently under-development

##### `POST api/events/:event_id/comments/:comment_id`

Create a new comment under comment with comment_id

Required arguments:

- `content`
- `x-access-token`

Status codes:

-   `201 Created` - the comment was created

Example response:

```json
{
    "data": {
        "9a69ee35-27e4-4504-bc6e-69af5d1e259c": {
            "public_id": "9a69ee35-27e4-4504-bc6e-69af5d1e259c",
            "date": "2021-04-17T09:39:58.590543",
            "content": "testing child comments",
            "author": "asdf",
            "child_comments": []
        }
    },
    "message": "comment successfully posted"
}
```
#### `PUT api/events/:event_id/comments/:comment_id`

Edit comment with comment_id

Required arguments:

- `x-access-token`
- `content`

Status codes:

- `200 - OK` - the comment was edited
- `403 Forbidden` - unathourized attempt at editing comment

Example response:

```json
{
    "data": {
        "d22f0085-ff69-4e86-abd4-6498c20cd545": {
            "public_id": "d22f0085-ff69-4e86-abd4-6498c20cd545",
            "date": "2021-04-17T08:09:41.670102",
            "content": "edited",
            "author": "asdf",
            "child_comments": []
        }
    },
    "message": "comment edited successfully"
}
```

#### `DELETE api/events/:event_id/comments/:comment_id`

Delete comment with comment_id

Required arguments:

-   `public_id`
-   `x-access-token`

Status codes:

-   `204 No Content` - the event was deleted successfully
-   `403 Forbidden` - unathourized attempt at deleting event

### Authentication

#### `GET api/auth`

Login to selected account with `username` and `password`. After the login it returns a `x-access-token`.

Example response:

```json
{
    "data": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImdyaXNobyIsImV4cCI6MTYxNTY0Njk4OH0.sHpYjTukwcVzpMZGFovALLrOYhGRi6hRCWpdedc7A88",
    "message": "successfully logged"
}
```

The `data` returned is the `x-access-token`

#### `POST api/auth`

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
        "username": "asdf",
        "full_name": "aeasfd sdfasdf",
        "description": "",
        "avatar_url": "/static/img/icak.jpg",
        "organized_events": {},
        "events": {}
    },
    "message": "user registered successfully"
}
```

<!-- TODO: Document even more stuff -->
