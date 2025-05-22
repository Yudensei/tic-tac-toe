const GameController = (function () {
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

    const displayBoard = function () {
      let displayedBoard = "";
      for (let y of board) {
        for (let cell of y) {
          displayedBoard += cell;
        }
        displayedBoard += "\n";
      }
      console.log(displayedBoard);
    };

    return { putSymbol, getCell, displayBoard };
  })();

  function createPlayer(symbol) {
    let wins = 0;

    const win = () => win++;
    const displayWins = () => console.log(wins);

    return { symbol, win, displayWins };
  }

  const player1 = createPlayer("X");
  const player2 = createPlayer("O");

  let activePlayer = player1;

  const changeActivePlayer = function () {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const makeMove = function (x, y) {
    Gameboard.putSymbol(activePlayer.symbol, x, y);
  };

  const showBoard = Gameboard.displayBoard;

  const checkWinner = function(x, y) {
    const symbol = activePlayer.symbol;

    const algorithm = [ [(x + 1) % 3, y, (x - 1) % 3, y],
                        [x, (y + 1) % 3, x, (y - 1) % 3],
                        [(x + 1), (y + 1) % 3, (x - 1), (y - 1) % 3],
                        [(x + 1), (y - 1) % 3, (x - 1), (y + 1) % 3]
    ]

    for (let step of algorithm) {
        if (Gameboard.getCell(step.at(0), step.at(1))
        === Gameboard.getCell(step.at(2), step.at(3))) {
            if (Gameboard.getCell(step[0], step[1]) !== symbol) continue;
            return activePlayer
        }
    }
    return "No one won";
  }

  return { changeActivePlayer, makeMove, showBoard, checkWinner };
})();

const DisplayController = (function() {
  
})()
