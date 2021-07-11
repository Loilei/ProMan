import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";
import { cardsManager } from "./cardsManager.js";
import { boardColumnsManager } from "./columnsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board)
            domManager.addChild("#root", content)
            domManager.addEventListener(`.board-toggle[data-board-id="${board.id}"]`,
                "click", showHideButtonHandler)
            domManager.addEventListener(`.board-add[data-board-id="${board.id}"]`,
                "click", createCard)
        }
    },
}

async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId
    await boardColumnsManager.loadColumns(boardId)
    cardsManager.loadCards(boardId)
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

