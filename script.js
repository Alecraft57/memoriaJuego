const tg = window.Telegram.WebApp;
tg.expand();

const emojis = ['🍎', '🍔', '🍕', '🍣', '🍦', '🍩', '🥑', '🌮'];
let cards = [...emojis, ...emojis]; 
let flippedCards = [];
let matchedCount = 0;

// --- NUEVAS VARIABLES ---
let seconds = 0;
let timerInterval = null;
let gameStarted = false;

const board = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

// Función para barajar
function shuffle() {
    cards.sort(() => 0.5 - Math.random());
}

function createBoard() {
    board.innerHTML = ""; // Limpiamos el tablero (útil al reiniciar)
    shuffle();
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = emoji;
        card.dataset.index = index;
        card.innerText = "?";
        card.onclick = () => flipCard(card);
        board.appendChild(card);
    });
}

// --- FUNCIÓN DEL RELOJ ---
function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
            seconds++;
            if(timerDisplay) timerDisplay.innerText = seconds;
        }, 1000);
    }
}

function flipCard(card) {
    // El reloj arranca con el primer toque
    startTimer();

    if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.innerText = card.dataset.value;
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 600);
        }
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.value === c2.dataset.value) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        matchedCount++;
        scoreDisplay.innerText = matchedCount;
        
        if (matchedCount === 8) {
            // --- DETENER JUEGO ---
            clearInterval(timerInterval); 
            
            setTimeout(() => {
                alert(`¡Victoria! Tiempo: ${seconds} segundos.`);
                // Enviamos el dato al bot para que Alejandro pueda guardarlo
                tg.sendData(`Completado en ${seconds}s`);
            }, 200);
        }
    } else {
        c1.innerText = "?";
        c2.innerText = "?";
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
    }
    flippedCards = [];
}

// Función extra por si quieres poner un botón de "Reiniciar"
function resetGame() {
    clearInterval(timerInterval);
    seconds = 0;
    matchedCount = 0;
    gameStarted = false;
    if(timerDisplay) timerDisplay.innerText = "0";
    if(scoreDisplay) scoreDisplay.innerText = "0";
    createBoard();
}

// Iniciar
createBoard();
