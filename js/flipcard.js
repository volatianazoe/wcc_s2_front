function flipcard() {
    const selectors = {
        boardContainer: document.querySelector(".board-container"),
        board: document.querySelector(".board"),
        moves: document.querySelector(".moves"),
        timer: document.querySelector(".timer"),
        start: document.querySelector("button"),
        win: document.querySelector(".win"),
    };

    const state = {
        gameStarted: false,
        flippedCards: 0,
        totalFlips: 0,
        totalTime: 0,
        loop: null,
    };

    const shuffle = (array) => {
        const clonedArray = [...array];

        for (let index = clonedArray.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            const original = clonedArray[index];

            clonedArray[index] = clonedArray[randomIndex];
            clonedArray[randomIndex] = original;
        }

        return clonedArray;
    };

    const pickRandom = (array, items) => {
        const clonedArray = [...array];
        const randomPicks = [];

        for (let index = 0; index < items; index++) {
            const randomIndex = Math.floor(Math.random() * clonedArray.length);

            randomPicks.push(clonedArray[randomIndex]);
            clonedArray.splice(randomIndex, 1);
        }

        return randomPicks;
    };

    const generateGame = () => {
        const dimensions = selectors.board.getAttribute("data-dimension");

        if (dimensions % 2 !== 0) {
            throw new Error(
                "The dimension of the board must be an even number."
            );
        }

        const emojis = [
            "lapin-cretin.JPG",
            "little-girl.jpg",
            "baby-boss.jpg",
            "benix.jpg",
            "blue-face.jpg",
            "gumball.jpg",
            "raya.jpg",
            "sonic.jpg",
            "yellow-face.jpg",
            "yellow-face.jpg",
        ];
        const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
        const items = shuffle([...picks, ...picks]);
        const cards = `
            <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
                ${items
                    .map(
                        (item) => `
                    <div class="card">
                        <div class="card-front"></div>
                        <div class="card-back"><img src="image/${item}" alt=""></div>
                    </div>
                `
                    )
                    .join("")}
           </div>
        `;

        const parser = new DOMParser().parseFromString(cards, "text/html");

        selectors.board.replaceWith(parser.querySelector(".board"));
    };

    const startGame = () => {
        state.gameStarted = true;
        selectors.start.classList.add("disabled");

        state.loop = setInterval(() => {
            state.totalTime++;

            selectors.moves.innerText = `${state.totalFlips} moves`;
            selectors.timer.innerText = `time: ${state.totalTime} sec`;
        }, 1000);
    };

    const flipBackCards = () => {
        document.querySelectorAll(".card:not(.matched)").forEach((card) => {
            card.classList.remove("flipped");
        });

        state.flippedCards = 0;
    };

    const flipCard = (card) => {
        state.flippedCards++;
        state.totalFlips++;

        if (!state.gameStarted) {
            startGame();
        }

        if (state.flippedCards <= 2) {
            card.classList.add("flipped");
        }

        if (state.flippedCards === 2) {
            const flippedCards = document.querySelectorAll(
                ".flipped:not(.matched)"
            );

            if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
                flippedCards[0].classList.add("matched");
                flippedCards[1].classList.add("matched");
            }

            setTimeout(() => {
                flipBackCards();
            }, 1000);
        }

        // If there are no more cards that we can flip, we won the game
        if (!document.querySelectorAll(".card:not(.flipped)").length) {
            setTimeout(() => {
                selectors.boardContainer.classList.add("flipped");
                selectors.win.innerHTML = `
                    <span class="win-text">
                        You won!<br />
                        with <span class="highlight">${state.totalFlips}</span> moves<br />
                        under <span class="highlight">${state.totalTime}</span> seconds
                    </span>
                `;

                clearInterval(state.loop);
            }, 1000);
        }
    };

    const attachEventListeners = () => {
        document.addEventListener("click", (event) => {
            const eventTarget = event.target;
            const eventParent = eventTarget.parentElement;

            if (
                eventTarget.className.includes("card") &&
                !eventParent.className.includes("flipped")
            ) {
                flipCard(eventParent);
            } else if (
                eventTarget.nodeName === "BUTTON" &&
                !eventTarget.className.includes("disabled")
            ) {
                startGame();
            }
        });
    };

    generateGame();
    attachEventListeners();
}

function flipcardHTML() {
    return `
        <div class="flipcard">
            <div class="controls">
                <button>Start</button>
                <div class="stats">
                    <div class="moves">0 moves</div>
                    <div class="timer">time: 0 sec</div>
                </div>
            </div>
            <div class="board-container">
                <div class="board" data-dimension="4"></div>
                <div class="win">You won!</div>
            </div>
        </div>
    `;
}
