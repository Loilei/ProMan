import os
from datetime import timedelta

from flask import Flask, render_template, url_for, session, request, flash, redirect

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
    return queries.get_boards()


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


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
            session['email'] = email
            session['username'] = queries.get_session_username(email)
            flash(f"You were successfully logged in, {session['username']}")

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

    return redirect(url_for("index"))


@app.route("/get_statuses/<int:board_id>")
@json_response
def get_statuses(board_id):
    return queries.get_statuses(board_id)


@app.route("/rename_column", methods=["PUT"])
def rename_status():
    data = request.get_json()
    column_id = data["column_id"]
    new_title = data["title"]
    queries.rename_status(column_id, new_title)


@app.route("/create-new-card", methods=["POST"])
def create_new_card():
    data = request.get_json()
    title = data["title"]
    column_id = data["column_id"]
    board_id = data["board_id"]
    card_number = queries.is_board_empty(column_id, board_id)
    if card_number == None:
        card_number = 1
    queries.save_card(title, column_id, board_id, card_number)


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


@app.route("/create-new-column/<columnId>/<board_id>/<title>", methods=["GET", "POST"])
@json_response
def create_new_column(columnId, board_id, title):
    return queries.save_column(columnId, board_id, title)


@app.route("/delete-column/<column_id>")
@json_response
def delete_column(column_id):
    return queries.delete_column(column_id)


@app.route("/delete-board/<board_id>")
@json_response
def delete_board(board_id):
    return queries.delete_public_board(board_id)


@app.route("/get-first-column-from-board/<board_id>")
@json_response
def get_first_column_from_board(board_id):
    return queries.get_first_column_from_board(board_id)
    return queries.get_cards_for_board(board_id)


@app.route("/create-board", methods= ["POST"])
@json_response
def add_new_board():
    if request.method == "POST":
        print(request.json)
        board_title = request.json['boardTitle']
        print(board_title)
        return queries.add_new_public_board(board_title)


# @app.route("/rename-board/<board_id>", methods="GET, POST")
# #json_response
# def rename_board(board_id):
#
#     if request.method == "POST":
#         new_title = request.form['title']
#         queries.rename_public_board(new_title, board_id)
#     else:
#         pass


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
