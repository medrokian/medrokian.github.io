const mainElement = document.getElementById("gameCards");
const modalElement = document.querySelector('.modal');
const resetButton = document.querySelector('.reset');
const gamesScore = document.querySelector('.games-score');
const attemptsScore = document.querySelector('.attempts-score');
const accuracyScore = document.querySelector('.accuracy-score');
const shuffleButton = document.querySelector('.shuffle-button');
const closeButton = document.querySelector('.close');
const matchesScore = document.querySelector('.matches-score');
const bodyElement = document.querySelector('body');

let firstCardClicked, secondCardClicked, firstCardClasses, secondCardClasses, maxMatches, matches, gamesPlayed, attempts, accuracy;

const cardDeck = ['uzi', 'j', 'V', 'n', 'doll', 'Thad', 'tessa', 'nori', 'Cyn', 'uzi', 'j', 'V', 'n', 'doll', 'Thad', 'tessa', 'nori', 'Cyn'];

accuracy = 0;
attempts = 0;
maxMatches = 9;
matches = 0;
gamesPlayed = 0;

mainElement.addEventListener('click', handleClick);
shuffleButton.addEventListener('click', shuffleCards);
resetButton.addEventListener('click', shuffleCards);
closeButton.addEventListener('click', dismissModal);

function handleClick(event) {
  const clickedTarget = event.target;

  if (clickedTarget.className.indexOf("card-back") === -1) {
    return;
  }

  clickedTarget.classList.add("hidden");

  if (!firstCardClicked) {
    firstCardClicked = clickedTarget;
    firstCardClasses = firstCardClicked.previousElementSibling.className;
  } else {
    secondCardClicked = clickedTarget;
    secondCardClasses = secondCardClicked.previousElementSibling.className;
    mainElement.removeEventListener('click', handleClick);
    if (firstCardClasses === secondCardClasses) {
      attempts += 1;
      attemptsScore.textContent = attempts;
      mainElement.addEventListener('click', handleClick);
      firstCardClicked = null;
      secondCardClicked = null;
      matches += 1;
      matchesScore.textContent = matches;
      accuracy = ((matches / attempts) * 100).toFixed(2);
      accuracyScore.textContent = accuracy+'%';
      if (matches === maxMatches) {
        modalElement.classList.remove("hidden");
        gamesPlayed += 1;
        gamesScore.textContent = gamesPlayed;
      }
    } else {
      attempts += 1;
      attemptsScore.textContent = attempts;
      accuracy = ((matches / attempts) * 100).toFixed(2);
      accuracyScore.textContent = accuracy+'%';
      setTimeout(function () {
        firstCardClicked.classList.remove("hidden");
        secondCardClicked.classList.remove("hidden");
        mainElement.addEventListener('click', handleClick);
        firstCardClicked = null;
        secondCardClicked = null;
      }, 1500);
    }
  }
}

function dismissModal () {
  modalElement.classList.add("hidden");
  matchesScore.textContent = 0;
  attemptsScore.textContent = 0;
  accuracyScore.textContent = '0.00%';
  resetCards();

}

function resetCards () {
  mainElement.innerHTML = '';
  const newCardDeck = cardDeck.sort(function() { return 0.5-Math.random() });
  for (let i = 0; i < newCardDeck.length; i++) {
    const newCardItem = document.createElement('div');
    newCardItem.classList.add("card-item", "col-2");
    const newCardFront = document.createElement('div');
    newCardFront.className = "card-front";
    newCardFront.classList.add(newCardDeck[i]);
    const newCardBack = document.createElement('div');
    newCardBack.classList.add("card-back");
    newCardItem.append(newCardFront, newCardBack);
    mainElement.appendChild(newCardItem);
  }
}

function shuffleCards () {
  matches = 0;
  matchesScore.textContent = matches;
  attempts = 0;
  attemptsScore.textContent = attempts;
  accuracy = "0.00";
  accuracyScore.textContent = accuracy + '%';
  const cardsHidden = document.querySelectorAll('.hidden');
  for (let i = 0; i < cardsHidden.length; i++) {
    cardsHidden[i].classList.remove("hidden");
  }
  modalElement.classList.add("hidden");
  resetCards();
}
