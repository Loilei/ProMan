from flask import Flask, render_template, url_for, request
from util import json_response

import queries

app = Flask(__name__)


@app.route("/")
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


@app.route("/create-board", methods="GET, POST")
#json_response?
def add_new_board():
    if request.method == "POST":
        board_title = request.form['title']
        id = queries.add_new_public_board(board_title)

    else:
        pass

@app.route("/rename-board/<board_id>", methods="GET, POST")
#json_response
def rename_board(board_id):

    if request.method == "POST":
        new_title = request.form['title']
        queries.rename_public_board(new_title, board_id)
    else:
        pass


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
