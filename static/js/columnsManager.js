import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";

export let boardColumnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getStatuses(boardId);
        for (let column of columns) {
            const columnsBuilder = htmlFactory(htmlTemplates.columns);
            const content = columnsBuilder(boardId, column);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content)
            $(`.column-title-input[data-column-id="${column.id}"]`)[0].hidden = true;
            domManager.addEventListener(`.board-column-title[data-board-column-title-id="${column.id}"]`,
                'click', renameColumn)
            domManager.addEventListener(`.column-remove[id="${column.id}"]`, 'click', deleteColumn)
        }
    }
}

export async function renameColumn(clickEvent){
    let tagTitleDiv = clickEvent.path[1];
    const columnId = tagTitleDiv.dataset.boardColumnTitleId;
    let tagInput = $(`.column-title-input[data-column-id="${columnId}"]`)[0];
    tagTitleDiv.hidden = true;
    if ( tagInput ) {
        tagInput.hidden = false;
        domManager.addEventListener(`.column-title-input[data-column-id="${columnId}"]`, "keydown", getUserInput);
    }
}

async function getUserInput(keyEvent) {
    let newColumnTitle = keyEvent.target.value;
    let columnId = keyEvent.target.getAttribute('data-column-id')
    if (keyEvent.key === "Enter") {
        if (newColumnTitle === "") {
            returnColumnTitle(columnId)
        } else {
            await dataHandler.renameColumn(columnId, newColumnTitle)
            returnColumnTitle(columnId, newColumnTitle)
        }
    } else if (keyEvent.key === "Escape") {
        returnColumnTitle(columnId)
    }
}

function returnColumnTitle(columnId, newColumnTitle=null){
    let tagTitleDiv = $(`.board-column-title[data-board-column-title-id="${columnId}"]`)[0];
    let tagInput = $(`.column-title-input[data-column-id="${columnId}"]`)[0];
    let titleSpan = $(`.board-column-title[data-board-column-title-id="${columnId}"] span`)[0]
    if (newColumnTitle !== null) { titleSpan.innerText = newColumnTitle }
    tagTitleDiv.hidden = false;
    tagInput.hidden = true;
}

export function deleteColumn(clickEvent){
    const columnId = clickEvent.path[1].attributes['id'].value
    dataHandler.deleteColumn(columnId)
    clickEvent.path[3].hidden = true
}
