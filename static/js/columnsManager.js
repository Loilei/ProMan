import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";

export let boardColumnsManager = {
    loadColumns: async function (boardId) {
        const columns = await dataHandler.getStatuses();
        for (let column of columns) {
            const columnsBuilder = htmlFactory(htmlTemplates.columns);
            const content = columnsBuilder(boardId, column);
            domManager.addChild(`.board-columns[data-board-id="${boardId}"]`, content)
            domManager.addEventListener(`.board-column-title[data-board-column-title-id="${column.id}"]`, 'click', renameColumn)
        }
    }
}

function renameColumn(clickEvent){
    // console.log(clickEvent)
    const columnId = clickEvent.target.dataset.boardColumnTitleId
    const columnTitle = clickEvent.target.innerText
    // console.log(columnId)
    // console.log(`${columnTitle}`)

    if (columnTitle !== "") {
        document.querySelector(`.board-column-title[data-board-column-title-id="${columnId}"]`).innerHTML =
            `<input id="columnTitle" type="text" class="form-control" placeholder='${columnTitle}'>
             <input type="submit">`
    }
    else {
        $(this).find('input').keypress(function (element) {
            // Enter pressed?
            if (element.which === 13) {
                let newColumnTitle = this.value
                // console.log(newColumnTitle)
                document.querySelector(".board-column-title").innerText = newColumnTitle
                
            }
        })
    }
    $(this).find('input[type=submit]').hide()
}


