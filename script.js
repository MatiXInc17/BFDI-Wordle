let wordList = [
    'blocky', 
    'bubble', 
    'coiny', 
    'david', 
    'eraser', 
    'firey', 
    'flower', 
    'golfball', 
    'icecube', 
    'leafy', 
    'match', 
    'needle', 
    'pen', 
    'pencil', 
    'pin',     
    'rocky', 
    'snowball', 
    'spongy', 
    'teardrop', 
    'tennisball', 
    'woody'
]; // List of characters in English

let secretWord = '';
let currentRow = 0;
let currentGuess = '';
const maxWordLength = 10;  // Allow up to 10 letters
const maxAttempts = 6;

const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');

// Initialize the game
function initializeGame() {
    // Select a random word from the list
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    currentRow = 0;
    currentGuess = '';
    message.textContent = '';
    restartButton.style.display = 'none';
    clearBoard();
    enableInput(); // Enable input when restarting
}

// Create the board with 10 letters per row
function clearBoard() {
    board.innerHTML = ''; // Clear the board
    for (let i = 0; i < maxAttempts; i++) {
        for (let j = 0; j < maxWordLength; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            board.appendChild(tile);
        }
    }
}

initializeGame();

// Create keyboard
const letters = 'qwertyuiopasdfghjklzxcvbnm';
letters.split('').forEach(letter => {
    const key = document.createElement('div');
    key.classList.add('key');
    key.textContent = letter;
    key.addEventListener('click', () => handleInput(letter));
    keyboard.appendChild(key);
});

// Add events to the "Submit" and "Delete" buttons
document.getElementById('submit').addEventListener('click', submitGuess);
document.getElementById('delete').addEventListener('click', () => {
    // Delete only the last letter from currentGuess and update the board
    if (currentGuess.length > 0) {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard(); // Update board after deletion
    }
});

function handleInput(letter) {
    if (currentGuess.length < maxWordLength) {  // Allow up to 10 letters
        currentGuess += letter;
        updateBoard();
    }
}

function updateBoard() {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const start = currentRow * maxWordLength;
    for (let i = 0; i < maxWordLength; i++) {
        tiles[start + i].textContent = i < currentGuess.length ? currentGuess[i] : ''; // Clear the cell if empty
    }
}

function submitGuess() {
    if (currentGuess.length === 0 || currentGuess.length > maxWordLength) {
        message.textContent = 'The word must be between 1 and 10 letters';
        return;
    }

    const tiles = Array.from(document.querySelectorAll('.tile'));
    const start = currentRow * maxWordLength;
    for (let i = 0; i < maxWordLength; i++) {
        if (i < currentGuess.length) {
            if (currentGuess[i] === secretWord[i]) {
                tiles[start + i].classList.add('correct');
            } else if (secretWord.includes(currentGuess[i])) {
                tiles[start + i].classList.add('present');
            } else {
                tiles[start + i].classList.add('absent');
            }
        }
    }

    if (currentGuess === secretWord) {
        message.textContent = 'Congratulations, you won!';
        disableInput();
        restartButton.style.display = 'block'; // Show restart button
        return;
    }

    currentRow++;
    currentGuess = ''; // Reset the current guess

    if (currentRow >= maxAttempts) {
        message.textContent = `You lost. The word was: ${secretWord}`;
        disableInput();
        restartButton.style.display = 'block'; // Show restart button
    }
}

function disableInput() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => key.style.pointerEvents = 'none'); // Disable the keyboard
    document.removeEventListener('keydown', handleKeyDown); // Disable physical keyboard
}

function enableInput() {
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => key.style.pointerEvents = 'auto'); // Enable the keyboard
    document.addEventListener('keydown', handleKeyDown); // Enable physical keyboard
}

function handleKeyDown(e) {
    const key = e.key.toLowerCase();
    if (key === 'enter') {
        submitGuess();
    } else if (key === 'backspace') {
        // Delete only the last letter from currentGuess and update the board
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard(); // Update board after deletion
        }
    } else if (/^[a-z]$/.test(key) && currentGuess.length < maxWordLength) {  // Allow up to 10 letters
        handleInput(key);
    }
}

// Listen for physical keyboard events
document.addEventListener('keydown', handleKeyDown);

// Handle game restart
restartButton.addEventListener('click', initializeGame);

