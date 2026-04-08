const tg = window.Telegram.WebApp;
tg.expand();

const emojis = ['🍎', '🍔', '🍕', '🍣', '🍦', '🍩', '🥑', '🌮'];
let cards = [...emojis, ...emojis]; // Duplicamos para tener parejas
let flippedCards = [];
let matchedCount = 0;

// Mezclar cartas
cards.sort(() => 0.5 - Math.random());

const board = document.getElementById('game-board');

function createBoard() {
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = emoji;
        card.dataset.index = index;
        card.innerText = "?"; // Oculto al inicio
        card.onclick = () => flipCard(card);
        board.appendChild(card);
    });
}

function flipCard(card) {
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
        document.getElementById('score').innerText = matchedCount;
        
        if (matchedCount === 8) {
            alert("¡Ganaste!");
            tg.sendData("Juego completado"); 
        }
    } else {
        c1.innerText = "?";
        c2.innerText = "?";
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
    }
    flippedCards = [];
}

// Iniciar el juego
createBoard();