from functools import wraps
from flask import jsonify
import time
import bcrypt


def json_response(func):
    """
    Converts the returned dictionary into a JSON response
    :param func:
    :return:
    """
    @wraps(func)
    def decorated_function(*args, **kwargs):
        return jsonify(func(*args, **kwargs))

    return decorated_function


def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('UTF-8'), salt)
    return hashed_password.decode('UTF-8')