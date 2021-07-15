export let dataHandler = {
    getBoards: async function () {
        let response = await apiGet('/get-boards')
        return response
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
        let response = await apiGet('/get_statuses')
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
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        let response = await apiPost(`/create-new-card/${boardId}/${cardTitle}/${statusId}`)
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
