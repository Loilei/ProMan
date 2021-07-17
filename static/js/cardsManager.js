import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card)
            domManager.addChild(`.board${card.board_id}-column-content[data-column-id="${card.status_id}"]`,
                content)
            domManager.addEventListener(`.card-remove[id="removeCard${card.id}"]`, "click",
                deleteButtonHandler)
            domManager.addEventListener(`.card-title[id="cardTitle${card.id}"]`, "click",
                updateCardTitle)
        }
    },
}

export function deleteButtonHandler(clickEvent) {
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
        } else if (event.keyCode === 27) {
            titleToUpdate.innerHTML= originalTitle;
        }

    })

}

export function movingCards () {

    const draggables = document.querySelectorAll('.card')
    const containers = document.querySelectorAll('.board-column')

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging')
        })

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging')
        })
        draggable.addEventListener('drop', () => {
            let columnId = draggable.parentElement.parentElement.id.slice(6);
            let currentColumn = draggable.parentElement;
            for (let i = 0; i < currentColumn.childElementCount; i++) {
                let cardNumber = i + 1;
                let cardId = currentColumn.childNodes[i].id.slice(4);
                dataHandler.updateCardPosition(cardNumber, cardId, columnId)
            }
        })
    })

    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault()
            const afterElement = getDragAfterElement(container, e.clientY)
            const draggable = document.querySelector('.dragging')
            if (afterElement == null) {
                container.children[1].appendChild(draggable)
            } else {
                // container.insertBefore(draggable, afterElement)
                afterElement.insertAdjacentElement('beforebegin', draggable)
            }
        })
    })

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')]

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    }
}