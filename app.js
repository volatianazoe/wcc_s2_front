const currentGameContainer = document.querySelector(".current-game");
const head = document.querySelector("head");

function mountGame(game, style) {
    currentGameContainer.style.left = "0";
    head.insertAdjacentHTML(
        "beforeend",
        `<link rel="stylesheet" class="game-style" href="./styles/${style}.css" />`
    );
    currentGameContainer.insertAdjacentHTML("afterbegin", game);
}

function unmountGame() {
    currentGameContainer.style.left = "100%";
    document.querySelector(".game-style").remove()
    currentGameContainer.innerHTML = `<span class="close-game text-gradient" onclick="unmountGame()">X</span>`;
}

function gameFactory(id) {
    if (id == 1) {
        mountGame(game1HTML(), "menja");
        return game1();
    }
    if (id == 2) {
        mountGame(game2HTML(), "colorblast");
        return game2();
    }
    if (id == 3) {
        mountGame(game3HTML(), "snake");
        return game3();
    }
}
