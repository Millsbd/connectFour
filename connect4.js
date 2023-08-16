
class Game {
  constructor(p1, p2, height = 6, width = 7) {
    this.players = [p1,p2];
    // why do we need to create an array of the players?
    this.height = height;
    this.width = width;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
    // why are we setting the functions with this here **We need to use this in the constructor so the methods are tied to the instance we are creating when we make something using new and the class template. 
    // Only call the make board functions in the constructor because those are the only ones that need to reload as part of the resetting a new empty board. 
    // Have to go through and change every insance of properties which exist in the methods below so they have this. included 
  }
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++){
      this.board.push(Array.from({ length: this.width}));
    }
  }
//  need to have everyting refering to this for it to be reused as part of the class template. 

makeHtmlBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');

  this.handleGameClick = this.handleClick.bind(this);
  top.addEventListener('click', this.handleGameClick);

  for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);

  // make main part of board
  for (let y = 0; y < this.height; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
}
findSpotForCol(x) {
  for (let y = this.height - 1; y >= 0; y--) {
    if (!this.board[y][x]) {
      return y;
    }
  }
  return null;
}

placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.style.backgroundColor = this.currPlayer.color;
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

endGame(msg) {
  alert(msg);
  const top = document.querySelector('#column-top');
  top.removeEventListener('click', this.handleGameClick);
}
handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer;
  this.placeInTable(y, x);
  
  // check for win
  if (this.checkForWin()) {
    this.gameOver = true;
    return this.endGame(`Player ${this.currPlayer.color} player won!`);
  }
  
  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }
    
  // switch players
  this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
}

checkForWin() {
  const _win = (cells) =>
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );

  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

document.querySelector('#start-game').addEventListener('click', () => {
  let p1 = new Player(document.querySelector('#p1-color').value);
  let p2 = new Player(document.querySelector('#p2-color').value);
  new Game(p1,p2);
});

// This is capturing the colors entered into the inputs and assigning the players those entered colors. The color typed in becomes the value passed into the Player class and assigns the color to that player. 




