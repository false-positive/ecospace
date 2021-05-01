"""
Routes and utility functions for user-uploaded files.
They are stored in `instance/usercontent` with optional subdirectories
"""

import os
import uuid
import imghdr
from contextlib import suppress

from flask import Blueprint, send_from_directory, current_app, abort
from PIL import Image

bp = Blueprint('user_content', __name__, url_prefix='/usercontent')


def get_image_ext(stream):
    """Get the image extension based on a file stream"""
    header = stream.read(512)
    stream.seek(0)
    img_fmt = imghdr.what(None, header)
    if not img_fmt:
        return None
    return '.' + (img_fmt if img_fmt != 'jpeg' else 'jpg')


def upload_image(file, path, filename=None, width=None):
    """Upload a jpg-converted image to the `instance/usercontent/{path}/` directory.

    Validate that the file is in an allowed format and if so, convert it to .jpg and save it.

    :param file: The incoming file
    :type file: werkzeug.datastructures.FileStorage
    :param path: The subdirs of the UPLOAD_PATH where the file should end up (eg. `instance/usercontent/pfp)
    :type path: str
    :param filename: The name of the image. If not given, a uuid4 will be generated. Useful when replacing exisiting images, defaults to None
    :type filename: str, optional
    :param width: Scale the image to this width and height. Used for avatars, to keep them square, defaults to None
    :type width: int, optional
    :return: The name of the file
    :rtype: str
    :raises: 400 if the file is not in an allowed format
    """

    filename = filename or f'{str(uuid.uuid4())}.jpg'
    directory = os.path.join(current_app.config['UPLOAD_PATH'], path)
    full_path = os.path.join(directory, filename)

    # Make sure that the data is in an allowed format
    if get_image_ext(file.stream) not in current_app.config['UPLOAD_EXTENSIONS']:
        abort(400)

    with suppress(OSError):
        os.makedirs(directory)

    # Convert the image to jpeg
    image = Image.open(file.data).convert('RGB')
    if width is not None:
        image.thumbnail((width, width), Image.ANTIALIAS)
    image.save(full_path)

    return filename


@bp.route('/<path:filepath>')
def get_image(filename):
    return send_from_directory(current_app.config['UPLOAD_PATH'], filename)
