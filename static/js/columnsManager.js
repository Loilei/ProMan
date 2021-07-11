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
            domManager.addEventListener(`.board-column-title[data-board-column-title-id="${column.id}"]`, 'click', renameColumn)
        }
    }
}

function renameColumn(clickEvent){
    const columnId = clickEvent.target.dataset.boardColumnTitleId
    const columnTitle = clickEvent.target.innerText
    if (columnTitle !== "") { changeTitleDiv(columnId, columnTitle) }
    else { $(this).find('input').keypress(function (element) {
        // Enter pressed?
        if (element.which === 13) {
            let newColumnTitle = this.value
            if (newColumnTitle !== ""){
                let columnId = clickEvent.path[1].attributes['data-board-column-title-id'].value
                document.querySelector(`.board-column-title[data-board-column-title-id="${columnId}"]`).innerText = newColumnTitle
                dataHandler.renameColumn(columnId, newColumnTitle)
            }
        }
    })
    }
    $(this).find('input[type=submit]').hide()
}

function changeTitleDiv(columnId, columnTitle){
    document.querySelector(`.board-column-title[data-board-column-title-id="${columnId}"]`).innerHTML =
            `<input id="columnTitle" type="text" class="form-control" placeholder='${columnTitle}'>
             <input type="submit">`
}

