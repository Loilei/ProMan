export let dataHandler = {
    getBoards: async function () {
        let response = await apiGet('/get-boards')
        return response
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function (boardId) {
        // the statuses are retrieved and then the callback function is called with the statuses
        let response = await apiGet(`/get_statuses/${boardId}`)
        return response
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        let response = await apiGet(`/get-cards/${boardId}`)
        return response
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (boardTitle) {
        // creates new board, saves it and calls the callback function with its data
        let response = await apiPost2("/create-board",boardTitle)
        console.log(response)
        return response
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        let bodyContent = {
        "title": cardTitle,
        "column_id": statusId,
        "board_id": boardId,
        }
        let response = await apiPost(`/create-new-card`, bodyContent)
        return response
        // creates new card, saves it and calls the callback function with its data
    },

    getLatestCardID: async function () {
        let response = await apiGet(`/get-latest-card-id`)
        return response
    },

    deleteCard: async function (cardID) {
        let response = await apiGet(`/delete-card/${cardID}`)
        return response
    },

    updateCardTitle: async function (cardID, newTitleText) {
        let bodyContent = {
            "card_id": cardID,
            "new_title_text": newTitleText
        }
        let response = await apiPut(`/update-card-title`, bodyContent)
    },

    updateCardPosition: async function (cardNumber, cardId, columnId) {
        let bodyContent = {
        "card_id": cardId,
        "card_order": cardNumber,
        "column_id": columnId
    }
        let response = await apiPut(`/update-card-position`, bodyContent)

    },
    renameColumn: async function (columnId, newColumnTitle) {
        let bodyContent = {
        "title": newColumnTitle,
        "column_id": columnId
        }
        let response = await apiPut(`/rename_column`, bodyContent)
    },

    getLatestStatus: async function () {
        let response = await apiGet(`/get-latest-column-id`)
        return response
    },
    createNewColumn: async function(columnId, boardId, title){
        let response = await apiPost(`/create-new-column/${columnId}/${boardId}/${title}`)
        return response
    },
    renameBoard: async function (boardData) {
        let response = await apiPut2("/rename-board", boardData)
        return response


    },
    deleteColumn: async function (columnId) {
        let response = await apiGet(`/delete-column/${columnId}`)
        return response
    },
    getFirstColumnFromBoard: async function (boardId) {
        let response = await apiGet(`/get-first-column-from-board/${boardId}`);
        return response
    },
    deleteBoard: async function (boardId) {
        let response = await apiGet(`/delete-board/${boardId}`)
        return response
    }
}

async function apiGet(url) {
    let response = await fetch(url, {
        method: 'GET',
    })
    if (response.status === 200) {
        let data = response.json()
        return data
    }
}

async function apiPost2 (url, payload) {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
      },
        body:JSON.stringify(payload)

    })
    if (response.status === 200) {
        let data = response.json()
        return data
    }
}

async function apiPut2 (url, payload) {
     let response = await fetch(url, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
      },
        body:JSON.stringify(payload)

    })
    if (response.status === 200) {
        let data = response.json()
        return data
    }
}

async function apiPost(url, body_content) {
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_content),
    })
}


async function apiDelete(url) {
    let response = await fetch(url, {
        method: 'DELETE',
    })
}


async function apiPut(url, body_content) {
    let response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_content),
    })
}
