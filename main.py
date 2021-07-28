import os
from datetime import timedelta

from flask import Flask, render_template, url_for, session, request, flash, redirect, make_response
from util import json_response, hash_password

import queries

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev')
app.permanent_session_lifetime = timedelta(days=1)


@app.route("/", methods=["GET", "POST"])
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    board = check_board_status()[0]
    if board == "private_boards":
        user_id = session['id']
        return queries.get_boards(user_id)
    return queries.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    checking_id = check_board_status()[1]
    return queries.get_cards(checking_id, board_id)


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        hashed_password = hash_password(password)
        queries.save_user(username, email, hashed_password)

    return render_template("registration.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        if queries.check_user_login(email, password):
            session_data = queries.get_session_data(email)
            session['email'] = session_data['email']
            session['username'] = session_data['username']
            session['id'] = session_data['id']
            resp = make_response(render_template('login.html'))
            resp.set_cookie("login", "success")
            resp.set_cookie("username", session_data['username'])
            resp.set_cookie("user_id", str(session_data['id']))
            flash(f"You were successfully logged in, {session['username']}")
            return resp
        else:
            flash('Login failed. Try again!')
            return redirect(url_for("index"))

    return render_template("login.html")


@app.route("/logout")
def logout():
    if "email" in session:
        flash(f"You've been logged out!, {session['username']}")
    session.pop("username", None)
    session.pop("email", None)
    session.pop("id", None)
    return redirect(url_for("index"))


@app.route("/get_statuses/<int:board_id>")
@json_response
def get_statuses(board_id):
    checking_id = check_board_status()[1]
    return queries.get_statuses(checking_id, board_id)


@app.route("/rename_column", methods=["PUT"])
def rename_status():
    data = request.get_json()
    column_id = data["column_id"]
    new_title = data["title"]
    return queries.rename_status(column_id, new_title)


@app.route("/create-new-card", methods=["POST"])
def create_new_card():
    checking_id = check_board_status()[1]
    data = request.get_json()
    title = data["title"]
    column_id = data["column_id"]
    board_id = data["board_id"]
    card_number = queries.is_board_empty(column_id, board_id, checking_id)
    if card_number is None:
        card_number = 1
    queries.save_card(checking_id, board_id, column_id, title, card_number)


@app.route("/get-latest-card-id")
@json_response
def get_latest_card_id():
    return queries.get_latest_card_id()


@app.route("/delete-card/<card_id>", methods=["GET", "POST"])
@json_response
def delete_card(card_id):
    return queries.delete_card(card_id)


@app.route("/update-card-title", methods=["PUT"])
def update_card_title():
    data = request.get_json()
    card_id = data["card_id"]
    new_title_text = data["new_title_text"]
    queries.update_card_title(card_id, new_title_text)


@app.route("/update-card-position", methods=["PUT"])
def update_card_position():
    data = request.get_json()
    card_id = data["card_id"]
    card_order = data["card_order"]
    column_id = data["column_id"]
    queries.update_card_position(card_id, card_order, column_id)


@app.route("/get-latest-column-id")
@json_response
def get_latest_column_id():
    return queries.get_latest_column_id()


@app.route("/create-new-column", methods=["POST"])
@json_response
def create_new_column():
    checking_id = check_board_status()[1]
    column_id = request.json['column_id']
    board_id = request.json['board_id']
    title = request.json['title']
    return queries.add_new_column(checking_id, column_id, board_id, title)


@app.route("/delete-column/<column_id>")
@json_response
def delete_column(column_id):
    return queries.delete_column(column_id)


@app.route("/delete-board/<board_id>")
@json_response
def delete_board(board_id):
    board = check_board_status()[0]
    checking_id = check_board_status()[1]
    return queries.delete_board(board, checking_id, board_id)


@app.route("/get-first-column-from-board/<board_id>")
@json_response
def get_first_column_from_board(board_id):
    checking_id = check_board_status()[1]
    try:
        return queries.get_first_column_from_board(checking_id, board_id)
    except IndexError:
        return 1


@app.route("/create-board", methods=["POST"])
@json_response
def add_new_board():
    board = check_board_status()[0]
    board_title = request.json['boardTitle']
    if board == "private_boards":
        user_id = session['id']
        return queries.add_new_board(board_title, user_id)
    return queries.add_new_board(board_title)


@app.route("/rename-board", methods=["PUT"])
@json_response
def rename_board():
    board = check_board_status()[0]
    new_title = request.json['boardTitle']
    board_id = request.json['boardId']
    return queries.rename_board(new_title, board_id, board)


def check_board_status():
    board = "public_boards"
    checking_id = "public_board_id"
    if "id" in session:
        board = "private_boards"
        checking_id = "private_board_id"
    return board, checking_id


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
