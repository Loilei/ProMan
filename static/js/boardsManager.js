import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";
import { cardsManager } from "./cardsManager.js";
import { boardColumnsManager } from "./columnsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            buildBoard(board)
        }
    },
    createNewBoard: async function () {
        let boardTitle = document.getElementById("new-board-title").value;
        let board = await dataHandler.createNewBoard({"boardTitle": boardTitle});
        // await this.loadBoards()
        buildBoard(board)
    },
}

function buildBoard (board) {
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(board)
    domManager.addChild("#root", content)
    domManager.addEventListener(`.board-toggle[data-board-id="${board.id}"]`, "click", showHideButtonHandler)
    domManager.addEventListener(`.board-add[data-board-id="${board.id}"]`, "click", createCard)
    domManager.addEventListener(`.board-add[data-board-column-id="${board.id}"]`, "click", createColumn, showHideButtonHandler)
    domManager.addEventListenerById(`board-title-${board.id}`,"click", showHideRename)
    domManager.addEventListenerById(`rename-board-title-${board.id}`,"keyup",renameBoard)
}


function showHideRename (clickEvent) {
        let boardId = clickEvent.target.getAttribute("data-board-id");
        document.getElementById(`board-title-${boardId}`).hidden = true;
        document.getElementById(`rename-board-title-${boardId}`).hidden = false;}


async function renameBoard (keyEvent) {
    let boardBackendId = keyEvent.target.getAttribute("data-board-id");
    let input_board = document.getElementById(`rename-board-title-${boardBackendId}`)
    let boardTitle = input_board.value;

    if (keyEvent.key === "Enter"){
        await dataHandler.renameBoard({"boardId": boardBackendId,"boardTitle": boardTitle})
    } else if (keyEvent.key === "Escape") {
        let previousValue = input_board.getAttribute("value")
        input_board.setAttribute("value", previousValue)

    }
}


async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId
    if (domManager.checkParentsExistence(`.board-column[data-board-id="${boardId}"]`) === true) {
        domManager.removeChild(`.board-columns[data-board-id="${boardId}"]`)
    }
    else {
        await boardColumnsManager.loadColumns(boardId);
        cardsManager.loadCards(boardId);
    }
}


async function createCard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let cardID = await dataHandler.getLatestCardID();
    cardID ++
    const tempCard = {
        title: "title",
        id: cardID,
        status_id: 1
    };
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const content = cardBuilder(tempCard);
    domManager.addChild(`.board${boardId}-column-content[data-column-id="${tempCard.status_id}"]`,
                content)
    // domManager.addEventListener(`.card[data-card-id="${tempCard.id}"]`, "click",
    //     cardsManager.deleteButtonHandler)

    let userInput = document.createElement("input");
    userInput.setAttribute('id',tempCard.id)
    userInput.setAttribute('type', 'text');
    const cardIdString = "card" + tempCard.id.toString();
    const newCard = document.getElementById(cardIdString);
    newCard.removeChild(newCard.childNodes[3]);
    newCard.appendChild(userInput);

    userInput.addEventListener("keydown", function(event){
        if (event.keyCode === 13) {
            event.preventDefault();
            const titleDiVToBeAdded = document.createElement("div")
            titleDiVToBeAdded.setAttribute("class", "card-title")
            const titleText = userInput.value;
            titleDiVToBeAdded.innerHTML += titleText;
            newCard.appendChild(titleDiVToBeAdded)
            newCard.removeChild(newCard.childNodes[4])
            dataHandler.createNewCard(titleText, boardId, tempCard.status_id)
        }
    })
}

async function createColumn(clickEvent){
    let boardId = clickEvent.target.dataset.boardColumnId;
    let columnId = await dataHandler.getLatestStatus();
    columnId ++;
    let title = "New column"
    dataHandler.createNewColumn(columnId, boardId, title)
}


