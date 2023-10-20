const cardData = {
    1: ['uzi.jpg', 'n.jpg', 'v.jpg', 'uzi.jpg', 'n.jpg', 'v.jpg'],
    2: ['uzi.jpg', 'n.jpg', 'v.jpg', 'uzi.jpg', 'n.jpg', 'v.jpg', 'doll.jpg', 'cyn.jpg', 'doll.jpg', 'cyn.jpg'],
    3: ['uzi.jpg', 'n.jpg', 'v.jpg', 'uzi.jpg', 'n.jpg', 'v.jpg', 'doll.jpg', 'cyn.jpg', 'doll.jpg', 'cyn.jpg', 'tessa.jpg', 'uzidad.jpg', 'tessa.jpg', 'uzidad.jpg'],
};

let level = 1;
let cards = [];
let cardsFlipped = 0;
let firstCard = null;
let secondCard = null;
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
        card.innerHTML = `<div class="card-inner">
            <div class="card-face card-back"></div>
            <div class="card-face card-front"><img src="${cardFaces[i]}" alt="Card Face"></div>
        </div>`;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    }
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('flip')) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        disableCards();
        playAudio('audio-good');

        if (cardsFlipped === level * 2) {
            playAudio('audio-win');
        }
    } else {
        lockBoard = true;
        playAudio('audio-fail');
        setTimeout(() => {
            unflipCards();
        }, 1000);
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    cardsFlipped += 2;
    resetBoard();
}

function unflipCards() {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
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
 
