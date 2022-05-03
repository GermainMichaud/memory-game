/* eslint-disable indent */
/* eslint-disable no-plusplus */
const game = {
  // Board element
  boardEl: document.querySelector('.board'),
  // Timer element
  timerEl: document.querySelector('.timer'),
  // Modal element
  modalEl: document.querySelector('.modal'),
  // Limit time
  limitTime: 10 * 60 * 1000, // 10 minutes
  // Time
  duration: 0,
  // Time interval
  interval: null,
  // Number of cards
  nbCards: 14, // Max 18
  // Cards
  cards: [],
  // Cards flipped
  flippedCards: [], // Array of 2 cards
  // Cards matched
  matchedCards: [],
  createBoard() {
    game.boardEl.innerHTML = '';
    game.cards = [];
    // For the number of cards, we have to create a pair of cards
    for (let i = 0; i < game.nbCards; i++) {
      for (let j = 0; j < 2; j++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = i;
        card.innerHTML = `
          <div class="card-back"></div>
          <div class="card-front" style="background-position-y: ${
            i * 100
          }px"></div>
        `;
        card.addEventListener('click', game.flipCard);
        game.cards.push(card);
      }
    }
    game.shuffleCards();
    game.boardEl.append(...game.cards);
  },
  // Shuffle cards
  shuffleCards() {
    for (let i = 0; i < game.nbCards * 2; i++) {
      // Get a random number
      const random = Math.floor(Math.random() * game.nbCards * 2);
      // Swap the cards
      const temp = game.cards[i];
      game.cards[i] = game.cards[random];
      game.cards[random] = temp;
    }
  },
  // Flip card
  flipCard(e) {
    if (game.flippedCards.length === 2) return;
    const card = e.target;
    if (card.classList.contains('flip')) return;
    card.classList.add('flip');
    game.flippedCards.push(card);
    if (game.flippedCards.length === 2) {
      game.checkMatch();
    }
  },
  // Check if cards match
  checkMatch() {
    if (game.flippedCards[0].dataset.id === game.flippedCards[1].dataset.id) {
      game.matchedCards.push(...game.flippedCards);
      game.flippedCards = [];
      game.checkWin();
    } else {
      setTimeout(() => {
        game.flippedCards.forEach((card) => {
          card.classList.remove('flip');
        });
        game.flippedCards = [];
      }, 1000);
    }
  },
  // Check if all cards are matched
  async checkWin() {
    if (game.matchedCards.length === game.nbCards * 2) {
      clearInterval(game.interval);
      game.interval = null;
      const userScore = await game.saveScore({ duration: game.duration });
      const highScores = await game.getHighScores();
      const userInHighScores = highScores.find(
        (score) => score.id === userScore.id,
      );
      const highscoreList = highScores.map(
        // eslint-disable-next-line comma-dangle
        (highscore, idx) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          `<li class="score-value ${
            userScore.id === highscore.id ? 'user' : ''
          }">#${idx + 1} - ${game.formatTime(highscore.duration, true)}</li>`,
      );
      game.showModal(
        'Vous avez gagné !',
        `
        ${
          userInHighScores
            ? 'Vous faites partie des 10 meilleurs scores !'
            : 'Malheureusement vous ne faites pas partie des 10 meilleurs scores.'
        }
        <ul class="score-list">${highscoreList.join('')}</ul>`,
        'Rejouer',
      );
    }
  },
  // Start timer
  startTimer() {
    const timerProgressEl = game.timerEl.querySelector('.timer-progress');
    const durationEl = game.timerEl.querySelector('.duration');
    game.interval = setInterval(() => {
      game.duration += 10;
      durationEl.textContent = game.formatTime(game.duration);
      timerProgressEl.style.width = `${
        (game.duration / game.limitTime) * 100
      }%`;
      if (game.duration >= game.limitTime) {
        clearInterval(game.interval);
        game.showModal(
          'Vous avez perdu !',
          'Le temps est écoulé...',
          'Rejouer',
        );
      }
    }, 10);
  },
  // Format time
  formatTime(duration, withMilliseconds = false) {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    const milliseconds = (duration % 1000).toFixed(0);
    if (withMilliseconds) {
      return `${minutes * 60 + Number(seconds)},${milliseconds / 10}s`;
    }
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  },
  addEventListener() {
    game.modalEl
      .querySelector('#btn-replay')
      .addEventListener('click', game.restart);
  },
  showModal(title, body, btnText) {
    game.modalEl.classList.add('show');
    game.modalEl.querySelector('.modal-title').textContent = title;
    game.modalEl.querySelector('.modal-body').innerHTML = body;
    game.modalEl.querySelector('#btn-replay').textContent = btnText;
  },
  restart() {
    game.modalEl.classList.remove('show');
    game.timerEl.style.display = 'block';
    game.duration = 0;
    game.createBoard();
    game.startTimer();
  },
  async showHighScore() {
    const highscores = await game.getHighScores();
    const highscoreList = highscores.map(
      // eslint-disable-next-line comma-dangle
      (highscore, idx) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        `<li class="score-value">#${idx + 1} - ${game.formatTime(
          highscore.duration,
          true,
        )}</li>`,
    );
    game.showModal(
      'Meilleurs scores',
      `<ul>${highscoreList.join('')}</ul>`,
      'Jouer',
    );
  },
  async getHighScores() {
    const response = await fetch('/highscores');
    const data = await response.json();
    return data;
  },
  async saveScore(score) {
    const response = await fetch('/save-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(score),
    });
    const data = await response.json();
    return data;
  },
  init() {
    game.addEventListener();
    game.showHighScore();
  },
};

document.addEventListener('DOMContentLoaded', game.init);
