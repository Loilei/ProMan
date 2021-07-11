import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card)
            domManager.addChild(`.board${boardId}-column-content[data-column-id="${card.status_id}"]`,
                content)
            domManager.addEventListener(`.card-remove[id="removeCard${card.id}"]`, "click",
                deleteButtonHandler)
            domManager.addEventListener(`.card-title[id="cardTitle${card.id}"]`, "click",
                updateCardTitle)
        }
    },
}

function deleteButtonHandler(clickEvent) {
    const cardToDelete = clickEvent.target.parentNode;
    const cardID = cardToDelete.id.slice(10);
    cardToDelete.parentNode.remove();
    dataHandler.deleteCard(cardID);
}

function updateCardTitle(clickEvent) {
    const titleToUpdate = clickEvent.target;
    const cardID = titleToUpdate.id.slice(9);
    const originalTitle = titleToUpdate.innerText;
    let userInput = document.createElement("input");
    userInput.placeholder = originalTitle;
    titleToUpdate.innerHTML= "";
    titleToUpdate.appendChild(userInput);

    userInput.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            const newTitleText = userInput.value;
            titleToUpdate.innerHTML = newTitleText;
            dataHandler.updateCardTitle(cardID, newTitleText)
        }
        else if (event.keyCode === 27) {
            titleToUpdate.innerHTML= originalTitle;
            }

    })

}