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

def add_new_public_board(cursor, board_title):
    new_board = '''insert into public_boards (title) 
                values (%s)
                returning id; '''
    cursor.execute(new_board, board_title)
    return id
    #TODO use data_manager?

def rename_public_board(cursor, new_title, board_id):
    title = """ update public_boards 
                    set title = %s 
                    where id= %s """
    cursor.execute(title, new_title, board_id)
    #TODO use data_manager