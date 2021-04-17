import functools
from uuid import uuid4
import datetime as dt

from flask_restful import abort, Resource, reqparse

from ..models import EventModel, CommentModel, db
from .auth import auth_token
from .event import pass_event

def pass_comment(view):
    """Decorator to pass a parameter to a view"""

    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        if 'comment_id' in kwargs:
            comment_id = kwargs.pop('comment_id')
            comment = CommentModel.query.filter_by(public_id=comment_id).first()
            print(comment_id)
            if not comment:
                abort(404, message=f'comment with id {comment_id} not found')
            kwargs['comment'] = comment
        return view(*args, **kwargs)

    return wrapped_view

def pass_parent_comment(view):
    """Decorator to pass a parameter to a view"""

    @functools.wraps(view)
    def wrapped_view(*args, **kwargs):
        if 'comment_id' in kwargs:
            comment_id = kwargs.pop('comment_id')
            comment = CommentModel.query.filter_by(public_id=comment_id).first()
            print(comment_id)
            kwargs['comment'] = comment
        return view(*args, **kwargs)

    return wrapped_view

comment_form_parser = reqparse.RequestParser()
comment_form_parser.add_argument('content', required=True)

class CommentList(Resource):
    @pass_event
    def get(self,event):
        comments = event.comments
        result = [comment.get_response() for comment in comments]
        return {
            'data': result,
            'message': 'comments listed successfully',
        }
    @pass_event
    @auth_token
    def post(self, current_user, event):
        args = comment_form_parser.parse_args()
        new_comment = CommentModel(
            public_id=str(uuid4()),
            content=args.get('content'),
            author_id=current_user.id,
        )
        event.comments.append(new_comment)
        db.session.add(new_comment)
        db.session.commit()
        return{
            'data': {new_comment.public_id: new_comment.get_response()},
            'message': 'comment successfully posted',
        }

class Comment(Resource):
    @pass_comment
    def get(self, comment, event_id):
        return{
            'data': comment.get_response(),
            'message': 'comment successfully found',
        }

    @pass_event
    @auth_token
    @pass_parent_comment
    def post(self, current_user, event, comment):
        args = comment_form_parser.parse_args()
        new_comment = CommentModel(
            public_id=str(uuid4()),
            content=args.get('content'),
            author_id=current_user.id,
        )
        if comment is not None:
            comment.child_comments.append(new_comment)
        else:
            event.comments.append(new_comment)
        db.session.add(new_comment)
        db.session.commit()
        return {
            'data': {new_comment.public_id: new_comment.get_response()},
            'message': 'comment successfully posted',
        }

    @auth_token
    @pass_comment
    def put(self, current_user, event_id, comment):
        if current_user.id != comment.author.id:
            abort(403, message="you cant do that")
        args = comment_form_parser.parse_args()
        comment.content = args.get('content') or comment.content
        db.session.commit()
        return{
            'data': comment.get_response(),
            'message': 'comment edited successfully',
        }

    @auth_token
    @pass_comment
    def delete(self, current_user, event_id, comment):
        if current_user.id != comment.author.id:
            abort(403, message="you cant do that")
        db.session.delete(comment)
        db.session.commit()
        return{
            'message': "comment deleted successfully",
        }, 204
