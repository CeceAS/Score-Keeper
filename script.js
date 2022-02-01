'use strict';

const addPlayerBtn = document.querySelector('.form__btn--add-player');
const letsPlayBtn = document.querySelector('.lets__play-btn');
const colorPickerBtn = document.querySelector('#color-picker');
const addNewScoreBtns = document.querySelectorAll('.form__btn--add-score');
const addMorePlayersBtn = document.querySelector('.add-more-players');

const containerPlayers = document.querySelector('.players-container');
const containerAddPlayers = document.querySelector('.add__players-container');
const containerScoreInput = document.querySelector('.score__input-container');
const containerAddMorePlayers = document.querySelector(
  '.add_more_players-container'
);

const playerNameInput = document.querySelector('.player__name-input');
const newScoreInput = document.querySelector('.score__input');

const playerScoreLabel = document.querySelector('.player__score');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn-close-modal');
const btnOpenModal = document.querySelector('.btn-show-modal');

class Player {
  id = (Date.now() + '').slice(-10);
  scores = [];
  totalScore = 0;

  constructor(playerName, color) {
    this.playerName = playerName;
    this.color = color;
  }
}

// test data:

const cece = new Player('Cece');
const bray = new Player('Bray');

////////////////////// Application Architecture //////////////////////

class App {
  #players = [];

  constructor() {
    // add event handlers
    addPlayerBtn.addEventListener('click', this._newPlayer.bind(this));

    letsPlayBtn.addEventListener('click', this._hideForm.bind(this));

    addMorePlayersBtn.addEventListener(
      'click',
      this._addMorePlayers.bind(this)
    );

    // hiding and showing Instructions modal:
    btnCloseModal.addEventListener('click', this._hideModal.bind(this));
    overlay.addEventListener('click', this._hideModal.bind(this));
    btnOpenModal.addEventListener('click', this._showModal.bind(this));

    document.addEventListener('keydown', this._hideModal.bind(this));
  }

  _newPlayer() {
    //  form data:
    const playerName = playerNameInput.value.toUpperCase();
    const playerColor = colorPickerBtn.value;

    let player;
    let canAddPlayer = true;

    // checking if name is valid:
    if (playerName.length === 0) return;

    this.#players.forEach(player => {
      if (player.playerName === playerName) {
        playerNameInput.value = '';
        alert('Players cannot have the same name!');
        return (canAddPlayer = false);
      }
    });

    if (canAddPlayer) {
      player = new Player(playerName, playerColor);
      this.#players.push(player);
      console.log('Players:', this.#players);

      // display players container if it's hidden:
      containerPlayers.classList.remove('hidden');

      // render player on page:
      this._renderNewPlayer(player);
    }

    // clear input:
    playerNameInput.value = '';
  }

  _renderNewPlayer(player) {
    let html = `
      <div class="player__row" id="${player.id}" data-id="${player.id}">
      <div class="player__name-container">
        <p class="player__number-label"></p>
        <div class="player__name" style="background-color: ${player.color}">${player.playerName}</div>
        <div><p><strong>Scores: </strong><span class="scores-array-${player.id}"></span></p></div>
      </div>
      <div class="flex-row">
      <div class="score__input-container ${player.id}-score__input-container">
        <input id="" type="number" class="add-score-${player.id}-input score__input form__input--amount" style="border:2px solid ${player.color};color: ${player.color}"/>
        <button id="add-score-${player.id}" data-id="${player.id}" class="btn form__btn form__btn--add-score" style="border:2px solid ${player.color};background-image:none;background-color: ${player.color}">+</button>
      </div>
      <div class="total__score-container">
        <p class="score-label">Score</p>
        <div id="display-score-${player.id}" class="player__score">
       0</div>
      </div>
      </div>
      </div>
    `;

    containerPlayers.insertAdjacentHTML('beforeend', html);

    // add event listener to each player container:
    document
      .getElementById(`add-score-${player.id}`)
      .addEventListener('click', this._addNewScore.bind(this));
  }

  _addNewScore(e) {
    const targetID = e.target.id;
    const targetPlayerID = e.target.dataset.id;
    const targetPlayerIDNumber = +e.target.dataset.id;
    const newScore = +document.querySelector(`.${targetID}-input`).value;

    if (newScore === 0) return;

    this.#players.forEach(function (player) {
      if (player.id === targetPlayerID) {
        player.scores.push(newScore);
        console.log(player);
      }
    });

    // add new score to scores array:
    this._displayScoresArray();

    // calculate total score:
    this._calcAndDisplayTotalScore();

    // clear score input:
    document.querySelector(`.${targetID}-input`).value = '';

    // show winner:
    this._showCurrentWinner();
  }

  _displayScoresArray() {
    this.#players.forEach(function (player) {
      document.querySelector(`.scores-array-${player.id}`).textContent =
        player.scores.join(', ');
    });
  }

  _calcAndDisplayTotalScore() {
    this.#players.forEach(function (player, i) {
      player.scores.reduce(
        (acc, score) => (player.totalScore = acc + score),
        0
      );

      const totalScoreDisplay = document.getElementById(
        `display-score-${player.id}`
      );

      totalScoreDisplay.textContent = player.totalScore;
    });
  }

  _hideForm() {
    if (!containerPlayers.classList.contains('hidden')) {
      containerAddPlayers.classList.add('hidden');
      containerAddMorePlayers.classList.remove('hidden');
    }
  }

  _addMorePlayers() {
    containerAddPlayers.classList.remove('hidden');
    containerAddMorePlayers.classList.add('hidden');
    // playerNameInput.focus();
  }

  _showCurrentWinner() {
    const winnerContainer = document.querySelector('.winner');
    const winnerTie = document.querySelector('.winner-tie');

    // hide container title:
    document.querySelector('.winner-container-title').classList.add('hidden');

    // use Map to store key value pairs:
    const scoresMap = new Map();

    this.#players.forEach((player, i) => {
      scoresMap.set(player.playerName, player.totalScore);
    });

    // sorting the scores and winners in order:
    const sortedScoresMap = new Map(
      [...scoresMap.entries()].sort((a, b) => b[1] - a[1])
    );

    const mapIterator = sortedScoresMap.entries();

    const playersOrdered = [];
    const scoresOrdered = [];
    let winners = [];
    let winnersTextStart;
    let winnersTextEnd;

    winnerContainer.textContent = '';

    for (const [playerName, score] of mapIterator) {
      playersOrdered.push(playerName);
      scoresOrdered.push(score);
    }

    console.log('players:', playersOrdered, 'scores', scoresOrdered);

    // if there's no tie;
    if (scoresOrdered[0] !== scoresOrdered[1]) {
      winnerTie.classList.add('hidden');

      winnerContainer.innerHTML = `
      <h2><span class="winner-title">${playersOrdered[0]}</span> is winning with a score of <span class="winner-title">${scoresOrdered[0]}</span> 🥳</h2>`;
    }

    // if there's a tie
    if (scoresOrdered[0] === scoresOrdered[1]) {
      winnerContainer.textContent = '';
      winnerTie.classList.remove('hidden');

      scoresOrdered.forEach((score, i, arr) => {
        if (score === arr[1]) {
          winners.push(playersOrdered[i]);
        }
      });

      if (winners.length === 2) {
        winnersTextStart = winners[0];
      }

      if (winners.length > 2) {
        winnersTextStart = winners.slice(0, -1).join(', ');
      }

      winnersTextEnd = winners.slice(-1);

      winnerContainer.innerHTML = `<h2><span class="winner-title">${winnersTextStart}</span> and <span class="winner-title">${winnersTextEnd}</span> are tied with a score of <span class="winner-title">${scoresOrdered[0]}</span> 🥳</h2>`;
    }
  }

  _hideModal(e) {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    // playerNameInput.focus();

    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      overlay.classList.add('hidden');
      // playerNameInput.focus();
    }
  }

  _showModal() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  _resetAllPlayers() {
    localStorage.removeItem('players');
    location.reload();
  }
}

const app = new App();

// note: what's left: style color picker,
