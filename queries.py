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


def get_statuses(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM statuses
        WHERE board_id = %(board_id)s;
        """
        , {"board_id": board_id})
    return matching_cards


def rename_status(column_id, new_title):
    data_manager.execute_update(
        """
        UPDATE statuses
        SET title = %(title)s
        WHERE id = %(column_id)s
        """, {"column_id": column_id, "title": new_title}
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


def delete_card(card_id):
    data_manager.execute_update(
        """
        DELETE from cards
        WHERE id = %(card_id)s
        """, {"card_id": card_id})


def update_card_title(card_id, new_title_text):
    data_manager.execute_update(
        """
        UPDATE cards
        SET title = %(new_title_text)s
        WHERE id = %(card_id)s
        """, {"card_id": card_id, "new_title_text": new_title_text})


def get_latest_column_id():
    return data_manager.execute_select(
        """
        SELECT max(id) FROM statuses
        ;
        """
    )[0]['max']


def save_column(columnId, boardId, title):
    data_manager.execute_update(
        """
        INSERT INTO statuses 
        (id, board_id, title)
        VALUES 
        (%(columnId)s, %(boardId)s, %(title)s)
        ; 
        """, {"columnId": columnId, "boardId": boardId, "title": title})


def delete_column(column_id):
    cards_exist = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE status_id = %(status_id)s
        """, {"status_id": column_id}
    )
    if len(cards_exist) != 0:
        data_manager.execute_update(
            """
            DELETE FROM cards
            WHERE status_id = %(status_id)s
            """, {"status_id": column_id}
        )
    data_manager.execute_update(
        """
        DELETE FROM statuses
        WHERE id = %(status_id)s
        """, {"status_id": column_id}
    )


def add_new_public_board(board_title):
    new_board = """ INSERT INTO public_boards (title) 
                VALUES (%(board_title)s)
                RETURNING id, title; """

    board = data_manager.execute_select(new_board, {"board_title": board_title}, fetchall=False)
    return board


def rename_public_board(new_title, board_id):
    rename_title = """ UPDATE public_boards 
                    SET title = %(new_title)s 
                    WHERE id= %(board_id)s 
                    RETURNING id, title; """
    renamed_board = data_manager.execute_select(rename_title, {"new_title": new_title, "board_id": board_id}, fetchall=False)
    return renamed_board

