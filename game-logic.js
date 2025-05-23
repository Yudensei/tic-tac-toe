function GameController() {
  const Gameboard = (function () {
    const board = [
      [" ", " ", " "],
      [" ", " ", " "],
      [" ", " ", " "],
    ];

    const putSymbol = function (symbol, x, y) {
      board[y][x] = symbol;
    };

    const getCell = (x, y) => board.at(y).at(x);

    const getBoard = () => board.slice();

    return { putSymbol, getCell, getBoard };
  })();

  function createPlayer(name = "Player", symbol) {
    let wins = 0;

    const win = () => win++;
    const displayWins = () => console.log(wins);

    return { name, symbol, win, displayWins };
  }

  const player1 = createPlayer("player1", "X");
  const player2 = createPlayer("player2", "O");

  let activePlayer = player1;

  const changeActivePlayer = function () {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const getActivePlayer = () => activePlayer;

  const makeMove = function (x, y) {
    Gameboard.putSymbol(activePlayer.symbol, x, y);
  };

  const getBoard = Gameboard.getBoard;

  const checkWinner = function (x, y) {
    const symbol = activePlayer.symbol;

    const algorithm = [
      [(x + 1) % 3, y, (x - 1) % 3, y],
      [x, (y + 1) % 3, x, (y - 1) % 3],
      [(x + 1) % 3, (y + 1) % 3, (x - 1) % 3, (y - 1) % 3],
      [(x + 1) % 3, (y - 1) % 3, (x - 1) % 3, (y + 1) % 3],
    ];

    for (let step of algorithm) {
      if (
        Gameboard.getCell(step.at(0), step.at(1)) === symbol &&
        Gameboard.getCell(step.at(2), step.at(3)) === symbol
      ) {
        return activePlayer;
      }
    }
    return "No one won";
  };

  return {
    activePlayer,
    getActivePlayer,
    changeActivePlayer,
    makeMove,
    getBoard,
    checkWinner,
  };
}

const DisplayController = (function () {
  const game = GameController();

  let activePlayer = game.getActivePlayer();

  const iconsTemplate = document.querySelector("template");
  const icons = iconsTemplate.content.children;

  const screenGrid = document.querySelector("#game");
  screenGrid.textContent = "";
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      const div = document.createElement("div");
      div.setAttribute("data-x", `${x}`);
      div.setAttribute("data-y", `${y}`);
      div.setAttribute("class", "cell");
      screenGrid.appendChild(div);
    }
  }

  screenGrid.addEventListener("click", (e) => {
    if (e.target.getAttribute("class") !== "cell") return;
    if (e.target.children.length !== 0) return;

    const target = e.target;
    const x = target.getAttribute("data-x");
    const y = target.getAttribute("data-y");

    let symbol;
    if (game.getActivePlayer().symbol === "X") {
      symbol = 0;
    } else {
      symbol = 1;
    }
    game.makeMove(+x, +y);
    target.append(icons[symbol].cloneNode());

    if (game.checkWinner(+x, +y) === game.getActivePlayer()) {
      console.log(game.checkWinner() + "won!");
      return;
    }

    game.changeActivePlayer();
  });
  return { game };
})();
