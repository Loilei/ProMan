import bcrypt

import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM public_boards
        ;
        """
    )


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def save_user(username, email, hashed_password):
    data_manager.execute_update(
    """
    INSERT INTO users 
    (username, email, password)
    VALUES 
    (%(username)s, %(email)s, %(password)s)
    ; 
    """, {"username": username, "email": email, "password": hashed_password})


def check_user_login(email, password):
    user_password = data_manager.execute_select(
        """
        SELECT password FROM users
        WHERE email = %(email)s
        ;
        """
        , {"email": email})

    return bcrypt.checkpw(password.encode('UTF-8'), user_password[0]["password"].encode('UTF-8'))


def get_session_username(email):
    username = data_manager.execute_select(
        """
        SELECT username FROM users
        WHERE email = %(email)s
        ;
        """
        , {"email": email})
    return username[0]["username"]


def get_statuses():
    return data_manager.execute_select(
        """
        SELECT * FROM statuses;
        """
    )


def save_card(boardId, cardTitle, statusId):
    max_card_order = data_manager.execute_select(
    """
    SELECT MAX(cards.card_order)
    FROM cards
    JOIN statuses
    ON cards.status_id = statuses.id
    WHERE cards.board_id = %(board_id)s and statuses.id = 1;
    """, {"board_id": boardId})[0]['max']
    max_card_order += 1
    data_manager.execute_update(
    """
    INSERT INTO cards 
    (board_id, title, status_id, card_order)
    VALUES 
    (%(board_id)s, %(title)s, %(status_id)s, %(card_order)s)
    ; 
    """, {"board_id": boardId, "title": cardTitle, "status_id": statusId, "card_order": max_card_order})


def get_latest_card_id():
    return data_manager.execute_select(
        """
        SELECT max(id) FROM cards
        ;
        """
    )[0]['max']
