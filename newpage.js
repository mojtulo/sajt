let gridSize = 3;
let pieces = [];
let currentPiece = null;
let isWon = false;
let currentImageIndex = 1;

function initializePuzzle() {
    const container = document.getElementById('puzzleContainer');
    container.innerHTML = '';
    pieces = [];
    isWon = false;

    const pieceWidth = 600 / gridSize;
    const pieceHeight = 600 / gridSize;

    for(let i = 0; i < gridSize * gridSize; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.width = pieceWidth + 'px';
        piece.style.height = pieceHeight + 'px';

        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        piece.style.backgroundImage = `url("slike/${currentImageIndex}.jpg")`;
        piece.style.backgroundSize = `${600}px ${600}px`;
        piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;

        piece.dataset.correctX = col * pieceWidth + 'px';
        piece.dataset.correctY = row * pieceHeight + 'px';

        pieces.push(piece);
        container.appendChild(piece);
    }

    shufflePuzzle();
    setupDragAndDrop();
}

function shufflePuzzle() {
    document.getElementById('winMessage').classList.remove('show');
    pieces.forEach(piece => {
        piece.style.left = Math.random() * (600 - parseInt(piece.style.width)) + 'px';
        piece.style.top = Math.random() * (600 - parseInt(piece.style.height)) + 'px';
        piece.classList.remove('correct');
    });
    isWon = false;
}

function setupDragAndDrop() {
    pieces.forEach(piece => {
        piece.addEventListener('mousedown', startDragging);
        piece.addEventListener('touchstart', startDragging);
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
}

function startDragging(e) {
    if(isWon) return;
    currentPiece = e.target;
    currentPiece.style.zIndex = '1000';
}

function drag(e) {
    if(!currentPiece || isWon) return;
    
    const x = (e.clientX || e.touches[0].clientX) - currentPiece.offsetWidth / 2;
    const y = (e.clientY || e.touches[0].clientY) - currentPiece.offsetHeight / 2;
    
    const container = document.getElementById('puzzleContainer');
    const rect = container.getBoundingClientRect();
    
    currentPiece.style.left = Math.max(0, Math.min(x - rect.left, 600 - currentPiece.offsetWidth)) + 'px';
    currentPiece.style.top = Math.max(0, Math.min(y - rect.top, 600 - currentPiece.offsetHeight)) + 'px';
}

function stopDragging() {
    if(!currentPiece || isWon) return;
    
    const tolerance = 30;
    if(Math.abs(parseInt(currentPiece.style.left) - parseInt(currentPiece.dataset.correctX)) < tolerance &&
       Math.abs(parseInt(currentPiece.style.top) - parseInt(currentPiece.dataset.correctY)) < tolerance) {
        currentPiece.style.left = currentPiece.dataset.correctX;
        currentPiece.style.top = currentPiece.dataset.correctY;
        currentPiece.classList.add('correct');
    }
    
    currentPiece.style.zIndex = '1';
    currentPiece = null;
    
    checkWin();
}

function checkWin() {
    const allCorrect = pieces.every(piece => piece.classList.contains('correct'));
    if(allCorrect) {
        isWon = true;
        document.getElementById('winMessage').classList.add('show');
    }
}

function changeDifficulty() {
    gridSize = gridSize === 3 ? 4 : gridSize === 4 ? 5 : 3;
    initializePuzzle();
}

function changeImage() {
    currentImageIndex = (currentImageIndex % 51) + 1;
    const container = document.getElementById('puzzleContainer');
    const pieces = container.getElementsByClassName('puzzle-piece');
    
    const newImage = `slike/${currentImageIndex}.jpg`;
    
    Array.from(pieces).forEach((piece, i) => {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        piece.style.backgroundImage = `url("${newImage}")`;
    });
}

// Initialize the puzzle when the page loads
window.onload = () => {
    initializePuzzle();
};