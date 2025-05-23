function GameController() {
  const Gameboard = (function () {
    let board = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];

    const putSymbol = function (symbol, x, y) {
      board[y][x] = symbol;
    };

    const getCell = (x, y) => board.at(y).at(x);

    const getBoard = () => board.slice();

    const newBoard = () => board = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];

    return { putSymbol, getCell, getBoard, newBoard };
  })();

  
  
  function createPlayer(symbol, name) {
    
    let wins = 0;

    const win = () => wins++;
    const getWins = () => wins;

    const getName = () => name;
    const setName = (newName) => {
        if (newName) {
            name = newName
        } else {
            name = "Player"
        }
    };

    return { symbol, getName, setName, win, getWins };
  }

  
  
  const player1 = createPlayer("X", "player1");
  const player2 = createPlayer("O", "player2");

  let activePlayer = player1;

  const changeActivePlayer = function () {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const getActivePlayer = () => activePlayer;

  const getBothPlayers = () => [player1, player2];

  let moves = 0;

  const makeMove = function (x, y) {
    Gameboard.putSymbol(activePlayer.symbol, x, y);
    moves++;
  };

  const getBoard = Gameboard.getBoard;

  const checkWinner = function (x, y) {
    console.log(x, y)
    const symbol = activePlayer.symbol;

    const algorithm = [
        [0, 0, 1, 0, 2, 0],
        [0, 1, 1, 1, 2, 1],
        [0, 2, 1, 2, 2, 2],
        
        [0, 0, 0, 1, 0, 2],
        [1, 0, 1, 1, 1, 2],
        [2, 0, 2, 1, 2, 2],

        [0, 0, 1, 1, 2, 2],
        [0, 2, 1, 1, 2, 0]
    ];

    for (let step of algorithm) {
      
      if (
        Gameboard.getCell(step.at(0), step.at(1)) === symbol &&
        Gameboard.getCell(step.at(2), step.at(3)) === symbol &&
        Gameboard.getCell(step.at(4), step.at(5)) === symbol
      ) {
        activePlayer.win();
        return activePlayer;
      }
    }

    if (moves === 9) return "It's a tie!";

    return "No one won yet";
  };

  const newRound = function() {
    Gameboard.newBoard();
    moves = 0;
    activePlayer = player1;
  }

  return {
    changeActivePlayer,
    getActivePlayer,
    getBothPlayers,
    makeMove,
    getBoard,
    checkWinner,
    newRound,
  };
}



const DisplayController = (function () {
  const body = document.querySelector("body");
  
  const iconsTemplate = document.querySelector("template");
  const icons = iconsTemplate.content.children;

  const screenGrid = document.querySelector("#game");

  const playButton = document.createElement("button");
  playButton.id = "play";
  playButton.textContent = "Play";

  const player1Info = document.querySelector("#player1-info");
  const player2Info = document.querySelector("#player2-info");

  const player1Name = document.querySelector("#player1-name");
  const player2Name = document.querySelector("#player2-name");

  let game = GameController();

  const getPlayers = game.getBothPlayers;
  
  playButton.addEventListener("click", (e) => {
    game.newRound();
    screenGrid.textContent = "";
    screenGrid.style.cssText = "";

    getPlayers()[0].setName(player1Name.value);
    getPlayers()[1].setName(player2Name.value);

    player1Info.children[0].innerHTML = `<p>${getPlayers()[0].getName()}: ${getPlayers()[0].getWins()}</p>`
    player2Info.children[0].innerHTML = `<p>${getPlayers()[1].getName()}: ${getPlayers()[1].getWins()}</p>`

    player1Name.remove();
    player2Name.remove();
    
    player2Info.style.cssText = "filter: brightness(50%)"

    playButton.style.display = "none";

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const div = document.createElement("div");
        div.setAttribute("data-x", `${x}`);
        div.setAttribute("data-y", `${y}`);
        div.setAttribute("class", "cell");
        screenGrid.appendChild(div);
      }
    }
  });

  body.appendChild(playButton);

  screenGrid.addEventListener("click", (e) => {
    if (e.target.getAttribute("class") !== "cell") return;
    if (e.target.children.length !== 0) return;

    const target = e.target;
    const x = target.getAttribute("data-x");
    const y = target.getAttribute("data-y");

    game.makeMove(+x, +y);

    let symbol;
    if (game.getActivePlayer().symbol === "X") {
      symbol = 0;
    } else {
      symbol = 1;
    }
    const icon = icons[symbol];
    target.append(icon.cloneNode());

    if (game.checkWinner(+x, +y) === game.getActivePlayer()) {
      endRound(false);
      return;
    } else if (game.checkWinner(+x, +y) === "It's a tie!") {
      endRound(true);
      return;
    }

    game.changeActivePlayer();

    if (game.getActivePlayer().symbol === "X") {
        player2Info.style.cssText = "filter: brightness(50%)"
        player1Info.style.cssText = ""
    } else {
        player1Info.style.cssText = "filter: brightness(50%)"
        player2Info.style.cssText = ""
    }
  });
  
  function endRound(tie, wins) {
    player1Info.children[0].innerHTML = `<p>${getPlayers()[0].getName()}: ${getPlayers()[0].getWins()}</p>`
    player2Info.children[0].innerHTML = `<p>${getPlayers()[1].getName()}: ${getPlayers()[1].getWins()}</p>`

    playButton.style.cssText = "display: block; opacity: 0.7";
    screenGrid.style.cssText = "pointer-events: none; filter: brightness(50%)";
    
    let result = `${game.getActivePlayer().getName()} won!`
    if (tie) result = `It's a tie!`;
    
    playButton.innerHTML = `<p>${result}</p> <p>Play again?</p>`;
  }

})();
