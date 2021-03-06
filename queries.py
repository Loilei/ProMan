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
        WHERE s.id = %(status_id)s;
        """, {"status_id": status_id})
    return status


def get_boards(user_id=None):
    """
    Gather all boards
    :return:
    """
    if user_id is None:
        return data_manager.execute_select(
            """
            SELECT * FROM public_boards;
            """)
    return data_manager.execute_select(
        """
        SELECT * FROM private_boards WHERE user_id = %(user_id)s;
        """, {"user_id": user_id})


def get_cards(checking_id, board_id):
    return data_manager.execute_select(
            f"""
            SELECT * FROM cards
            WHERE {checking_id} = %(board_id)s
            ORDER BY card_order;
            """, {"board_id": board_id})


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
        WHERE email = %(email)s;
        """, {"email": email})
    return bcrypt.checkpw(password.encode('UTF-8'), user_password[0]["password"].encode('UTF-8'))


def get_session_data(email):
    user_data = data_manager.execute_select(
        """
        SELECT * FROM users
        WHERE email = %(email)s;
        """, {"email": email})
    return user_data[0]


def get_statuses(checking_id, board_id):
    return data_manager.execute_select(
        f"""
        SELECT * FROM statuses
        WHERE {checking_id} = %(board_id)s
        ORDER BY id;
        """, {"board_id": board_id})


def rename_status(column_id, new_title):
    rename_title = """
        UPDATE statuses
        SET title = %(title)s
        WHERE id = %(column_id)s
        RETURNING id, title """
    renamed_status = data_manager.execute_select(rename_title, {"column_id": column_id, "title": new_title},
                                                 fetchall=False)
    return renamed_status


def is_board_empty(column_id, board_id, checking_id):
    max_card_order = data_manager.execute_select(
        f"""
        SELECT MAX(cards.card_order)
        FROM cards
        JOIN statuses
        ON cards.status_id = statuses.id
        WHERE cards.{checking_id} = %(board_id)s and statuses.id = %(column_id)s;
        """, {"board_id": board_id, "column_id": column_id})[0]['max']
    return max_card_order


def save_card(checking_id, board_id, column_id, title, card_number):
    data_manager.execute_update(
        f"""
        INSERT INTO cards 
        ({checking_id}, status_id, title, card_order)
        VALUES 
        (%(board_id)s, %(status_id)s, %(title)s, %(card_order)s); 
        """, {"board_id": board_id, "status_id": column_id, "title": title,  "card_order": card_number})


def get_latest_card_id():
    return data_manager.execute_select(
        """
        SELECT max(id) FROM cards;
        """)[0]['max']


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


def update_card_position(card_id, card_order, column_id):
    data_manager.execute_update(
        """
        UPDATE cards
        SET card_order = %(card_order)s, status_id = %(column_id)s
        WHERE id = %(card_id)s
        """, {"card_id": card_id, "card_order": card_order, "column_id": column_id})


def get_latest_column_id():
    return data_manager.execute_select(
        """
        SELECT max(id) FROM statuses;
        """)[0]['max']


def add_new_column(checking_id, column_id, board_id, title):
    new_column = f"""
        INSERT INTO statuses 
        (id, {checking_id}, title)
        VALUES 
        (%(column_id)s, %(board_id)s, %(title)s)
        RETURNING id, {checking_id}, title;
        """
    column = data_manager.execute_select(new_column, {"column_id": column_id, "board_id": board_id, "title": title})
    return column


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


def get_first_column_from_board(checking_id, board_id):
    return data_manager.execute_select(f"""
                SELECT id
                FROM statuses
                WHERE {checking_id} = %(board_id)s
                ORDER BY id
                LIMIT 1;
            """, {"board_id": board_id})[0]['id']


def delete_board(board, checking_id, board_id):
    cards_exist = data_manager.execute_select(
        f"""
        SELECT * FROM cards
        WHERE {checking_id} = %(board_id)s
        """, {"board_id": board_id}
    )
    if len(cards_exist) != 0:
        data_manager.execute_update(
            f"""
            DELETE FROM cards
            WHERE {checking_id} = %(board_id)s
            """, {"board_id": board_id}
        )
    statuses_exist = data_manager.execute_select(
        f"""
        SELECT * FROM statuses
        WHERE {checking_id} = %(board_id)s
        """, {"board_id": board_id}
    )
    if len(statuses_exist) != 0:
        data_manager.execute_update(
            f"""
            DELETE FROM statuses
            WHERE {checking_id} = %(board_id)s
            """, {"board_id": board_id}
        )
    data_manager.execute_update(
        f"""
        DELETE FROM {board}
        WHERE id = %(board_id)s
        """, {"board_id": board_id}
    )


def add_new_board(board_title, user_id=None):
    if user_id is None:
        return data_manager.execute_select(
            """ INSERT INTO public_boards (title) 
                VALUES (%(title)s)
                RETURNING id, title; """, {"title": board_title}, fetchall=False)
    return data_manager.execute_select(
        """ INSERT INTO private_boards (user_id, title) 
            VALUES (%(user_id)s, %(title)s)
            RETURNING id, title; """, {"user_id": user_id, "title": board_title}, fetchall=False)


def rename_board(new_title, board_id, board):
    rename_title = f""" UPDATE {board}
                        SET title = %(new_title)s 
                        WHERE id= %(board_id)s 
                        RETURNING id, title; """
    renamed_board = data_manager.execute_select(rename_title, {"new_title": new_title, "board_id": board_id},
                                                fetchall=False)
    return renamed_board
