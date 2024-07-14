const grid = document.getElementById('grid');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const newGameButton = document.getElementById('newGameButton');
const exitGameButton = document.getElementById('exitGameButton');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const startGameButton = document.getElementById('startGameButton'); // New start game button in the Welcome tab
const welcomeTab = document.getElementById('welcome');
const gameTab = document.getElementById('game');

const X_CLASS = 'x';
const O_CLASS = 'o';
let oTurn;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Start the game directly when the Start Game button is clicked
startGameButton.addEventListener('click', function() {
    openTab('game');
});

// Event listeners
restartButton.addEventListener('click', startGame);
newGameButton.addEventListener('click', newGame);
exitGameButton.addEventListener('click', exitGame);

// Switch tabs
function openTab(tabName) {
    if (tabName === 'game') {
        gameTab.classList.add('active');
        welcomeTab.classList.remove('active');
        startGame();
    }
}

// Initialize the game
function startGame() {
    oTurn = false;
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-cell', '');
        cell.addEventListener('click', handleClick, { once: true });
        grid.appendChild(cell);
    }
    setStatusText();
}

// Handle cell click
function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    clickSound.play();
    if (checkWin(currentClass)) {
        endGame(false, currentClass);
        winSound.play();
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setStatusText();
    }
}

// Place mark on the cell
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass.toUpperCase();
}

// Swap turns
function swapTurns() {
    oTurn = !oTurn;
}

// Set status text
function setStatusText() {
    statusText.textContent = `Player ${oTurn ? "O" : "X"}'s turn`;
}

// End the game
function endGame(draw, currentClass = '') {
    if (draw) {
        statusText.textContent = "It's a draw!";
    } else {
        statusText.textContent = `Player ${currentClass.toUpperCase()} wins!`;
        highlightWinningCells(currentClass);
        updateScore(currentClass);
    }
    const cells = document.querySelectorAll('[data-cell]');
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}

// Highlight winning cells
function highlightWinningCells(currentClass) {
    WINNING_COMBINATIONS.forEach(combination => {
        const [a, b, c] = combination;
        const cells = document.querySelectorAll('[data-cell]');
        if (cells[a].classList.contains(currentClass) &&
            cells[b].classList.contains(currentClass) &&
            cells[c].classList.contains(currentClass)) {
            cells[a].style.backgroundColor = '#6c63ff';
            cells[b].style.backgroundColor = '#6c63ff';
            cells[c].style.backgroundColor = '#6c63ff';
        }
    });
}

// Check if it's a draw
function isDraw() {
    const cells = document.querySelectorAll('[data-cell]');
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

// Check if there's a win
function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return document.querySelectorAll('[data-cell]')[index].classList.contains(currentClass);
        });
    });
}

// Update the score
function updateScore(currentClass) {
    if (currentClass === X_CLASS) {
        scoreX.textContent = parseInt(scoreX.textContent) + 1;
    } else {
        scoreO.textContent = parseInt(scoreO.textContent) + 1;
    }
}

// Reset scores and start a new game
function newGame() {
    scoreX.textContent = '0';
    scoreO.textContent = '0';
    openTab('game'); // Switch to game tab
}

// Exit game (This function will not work in browsers due to security reasons)
function exitGame() {
    window.open('', '_self', ''); // To close the current tab
    window.close();
}
