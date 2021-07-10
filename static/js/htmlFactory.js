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
                <section class="board" data-board-id="${board.id}">
                    <div class="board-header">
                        <span class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button class="board-toggle" data-board-id="${board.id}">Show Cards</button>
                    </div>
                    <div class="board-columns" data-board-id="${board.id}"></div>
                </section>
            </div>`;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">
                <div class="card-remove"></div>
                <div class="card-title">${card.title}</div>
            </div>`;
}

function columnsBuilder(boardId, column){
    return `<div class="board-column" data-board-id="${boardId}">
                <div class="board-column-title" data-board-column-title-id="${column.id}">${column.title}</div>
                <div class="board${boardId}-column-content" data-column-id="${column.id}"></div>
            </div>`
}
