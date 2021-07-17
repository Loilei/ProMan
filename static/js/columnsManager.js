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
            domManager.addEventListener(`.board-column-title[data-board-column-title-id="${column.id}"]`,
                'click', renameColumn)
            domManager.addEventListener(`.column-remove[id="${column.id}"]`, 'click', deleteColumn)
        }
    }
}

async function renameColumn(clickEvent){
    const columnId = clickEvent.target.dataset.boardColumnTitleId;
    const columnTitle = clickEvent.target.innerText;
    const columnShowNumber = document.querySelectorAll('input').length;
    if (columnTitle !== "" && columnShowNumber === 0) { changeTitleDiv(columnId, columnTitle) }
    else { $(this).find('input').keypress(async function (element) {
        // Enter pressed?
        if (element.which === 13) {
            let newColumnTitle = this.value;
            let columnId = clickEvent.path[1].attributes['data-board-column-title-id'].value;
            if (newColumnTitle === "") {
                returnTitleDiv(columnId)
            } else {
                $(`.board-column-title[data-board-column-title-id="${columnId}"]`)[0].innerText = newColumnTitle
                await dataHandler.renameColumn(columnId, newColumnTitle)
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

function returnTitleDiv(columnId){
    let divTitle = document.getElementById('columnTitle').placeholder
    document.querySelector(`.board-column-title[data-board-column-title-id="${columnId}"]`).innerHTML =
        `<div class="board-column-title" data-board-column-title-id="${columnId}">${divTitle}
            <div class="column-remove" id="${columnId}"><i class="fas fa-trash-alt"></i></div>
        </div>`
    domManager.addEventListener(`.column-remove[id="${columnId}"]`, 'click', deleteColumn)
}

function deleteColumn(clickEvent){
    const columnId = clickEvent.path[1].attributes['id'].value
    dataHandler.deleteColumn(columnId)
    clickEvent.path[3].hidden = true
}
