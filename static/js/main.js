import { boardsManager } from "./boardsManager.js";

function init() {
    boardsManager.loadBoards()
}

function initCreateNewBoard(){
    document.getElementById("new-board-create-button").addEventListener("click", function(){
      document.getElementById("new-board-create-button").hidden = true;
      document.getElementById("new-board-title").hidden = false;
      document.getElementById("new-board-save-button").hidden = false;
    })
    document.getElementById("new-board-save-button").addEventListener("click",function() {
      document.getElementById("new-board-create-button").hidden = false;
      document.getElementById("new-board-title").hidden = true;
      document.getElementById("new-board-save-button").hidden = true;
      boardsManager.createNewBoard() }
  )
}

export function checkPageStatus(){
    let cookies = document.cookie.split('; ')
    if ("login=success" === cookies[0]){
        console.log(document.cookie)
        return "private"
    }
    else {
        return "public"
    }
}


init();
checkPageStatus()
initCreateNewBoard();

