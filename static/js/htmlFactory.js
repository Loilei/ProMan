export const htmlTemplates = {
    board: 1,
    card: 2,
    columns: 3
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.columns:
            return columnsBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(board) {
    return `<div class="board-container">
                <section class="board" data-board-id="${board.id}" id="board${board.id}">
                    <div class="board-header">
                        <span class="board-title">${board.title}</span>
                        <button class="board-add" data-board-id="${board.id}">Add Card</button>
                        <button class="board-toggle" data-board-id="${board.id}">Show Cards</button>
                    </div>
                    <div class="board-columns" data-board-id="${board.id}"></div>
                </section>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" id="card${card.id}">
                <div class="card-remove" id="removeCard${card.id}"><i class="fas fa-trash-alt"></i></div>
                <div class="card-title" id="cardTitle${card.id}">${card.title}</div>
            </div>`;
}

function columnsBuilder(boardId, column){
    return `<div class="board-column" id="column${column.id}">
                <div class="board-column-title">${column.title}
                    <div class="board${boardId}-column-content" data-column-id="${column.id}"></div>
                </div>
            </div>`
}
