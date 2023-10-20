// Define your card data for each level
const cardData = {
    1: ['uzi.jpg', 'n.jpg', 'v.jpg', 'uzi.jpg', 'n.jpg', 'v.jpg'],
    2: ['uzi.jpg', 'n.jpg', 'v.jpg', 'uzi.jpg', 'n.jpg', 'v.jpg', 'doll.jpg', 'cyn.jpg', 'doll.jpg', 'cyn.jpg'],
    3: ['uzi.jpg', 'n.jpg', 'v.jpg', 'uzi.jpg', 'n.jpg', 'v.jpg', 'doll.jpg', 'cyn.jpg', 'doll.jpg', 'cyn.jpg', 'tessa.jpg', 'uzidad.jpg', 'tessa.jpg', 'uzidad.jpg'],
};

let level = 1;
let cards = [];
let cardsFlipped = 0;
let firstCard, secondCard;
let lockBoard = false;

function startGame(selectedLevel) {
    level = selectedLevel;
    cards = [];
    cardsFlipped = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    const cardFaces = cardData[level].sort(() => Math.random() - 0.5);

    for (let i = 0; i < level * 2; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardFaces[i];
        card.innerHTML = `<img src="back.svg" class="back" alt="Card Back"><img src="${cardFaces[i]}" class="front" alt="Card Face">`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    cardsFlipped += 2;

    if (cardsFlipped === level * 2) {
        playAudio('audio-win');
    } else {
        playAudio('audio-good');
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    playAudio('audio-fail');
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function playAudio(audioId) {
    const audio = document.getElementById(audioId);
    audio.currentTime = 0;
    audio.play();
}

startGame(1);
