import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";
import { cardsManager } from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        // domManager.removeAllChildren("#root")
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            buildBoard(board)
            // const boardBuilder = htmlFactory(htmlTemplates.board);
            // const content = boardBuilder(board)
            // domManager.addChild("#root", content)
            // domManager.addEventListener(`.toggle-board-button[data-board-id="${board.id}"]`, "click", showHideButtonHandler)
        }
    },
    createNewBoard: async function () {
        let boardTitle = document.getElementById("new-board-title").value;
        let board = await dataHandler.createNewBoard({"boardTitle": boardTitle});
        // await this.loadBoards()
        buildBoard(board)
        // const boardBuilder = htmlFactory(htmlTemplates.board);
        // const content = boardBuilder(board)
        // domManager.addChild("#root", content)
        // domManager.addEventListener(`.toggle-board-button[data-board-id="${board.id}"]`, "click", showHideButtonHandler)
    },
    renameBoard: async function(){}

}

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId
    cardsManager.loadCards(boardId)
}

function buildBoard (board) {
    const boardBuilder = htmlFactory(htmlTemplates.board);
    const content = boardBuilder(board)
    domManager.addChild("#root", content)
    domManager.addEventListener(`.toggle-board-button[data-board-id="${board.id}"]`, "click", showHideButtonHandler)
}
