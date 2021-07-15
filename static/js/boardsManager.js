import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";
import { cardsManager, deleteButtonHandler, movingCards } from "./cardsManager.js";
import { boardColumnsManager } from "./columnsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board)
            domManager.addChild("#root", content)
            domManager.addEventListener(`.board-toggle[data-board-id="${board.id}"]`,
                "click", showHideButtonHandler);
            domManager.addEventListener(`.board-add[data-board-id="${board.id}"]`,
                "click", createCard)
            domManager.addEventListener(`.board-add[data-board-column-id="${board.id}"]`,
                "click", createColumn)
        }
    },
}

async function showHideButtonHandler(clickEvent) {
    let columnsTag = clickEvent.target.parentElement.nextElementSibling;
    if (columnsTag.hasChildNodes() === false) {
        const boardId = clickEvent.target.dataset.boardId;
        await boardColumnsManager.loadColumns(boardId);
        await cardsManager.loadCards(boardId);
        movingCards();
    } else {
        removeAllChildNodes(columnsTag);
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}


async function createCard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    let cardID = await dataHandler.getLatestCardID();
    cardID ++
    let columnId = await dataHandler.getFirstColumnFromBoard(boardId);
    const tempCard = {
        title: "title",
        id: cardID,
        status_id: columnId
    };
    const cardBuilder = htmlFactory(htmlTemplates.card);
    const content = cardBuilder(tempCard);
    domManager.addChild(`.board${boardId}-column-content[data-column-id="${tempCard.status_id}"]`,
                content)
    domManager.addEventListener(`.card-remove[id="removeCard${tempCard.id}"]`,
                "click", deleteButtonHandler);

    let userInput = document.createElement("input");
    userInput.setAttribute('id',tempCard.id)
    userInput.setAttribute('type', 'text');
    const cardIdString = "card" + tempCard.id.toString();
    const newCard = document.getElementById(cardIdString);
    newCard.removeChild(newCard.childNodes[3]);
    newCard.appendChild(userInput);

    userInput.addEventListener("keydown", async function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            const titleDiVToBeAdded = document.createElement("div");
            titleDiVToBeAdded.setAttribute("class", "card-title")
            const titleText = userInput.value;
            titleDiVToBeAdded.innerHTML += titleText;
            newCard.appendChild(titleDiVToBeAdded);
            newCard.removeChild(newCard.childNodes[4]);
            await dataHandler.createNewCard(titleText, boardId, tempCard.status_id);
        } else if (event.keyCode === 27) {
            newCard.outerHTML = "";
        }
    })
}

async function createColumn(clickEvent){
    let boardId = clickEvent.target.dataset.boardColumnId;
    let columnId = await dataHandler.getLatestStatus();
    columnId ++;
    let title = "New_column"
    await dataHandler.createNewColumn(columnId, boardId, title)
    // showBoardWithNewColumn(boardId)
}

async function showBoardWithNewColumn(boardId){
    if (domManager.checkParentsExistence(`.board-column[data-board-id="${boardId}"]`) === true) {
        domManager.removeChild(`.board-columns[data-board-id="${boardId}"]`)
    }
    else {
        await boardColumnsManager.loadColumns(boardId);
        await cardsManager.loadCards(boardId);
    }
}
