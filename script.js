'use strict';

// const clockSpot = document.querySelector('.clock');

// const displayClock = function () {
//   const time = new Date();

//   const options = {
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//   };

//   const timeFormat = Intl.DateTimeFormat('en-US', options).format(time);
//   clockSpot.textContent = timeFormat;
// };

// setInterval(displayClock, 1000);

// displayClock();

// note: FLOW CHART

// player adds name -> name appears in players.
// game starts. First player scores, socre is added to that player -> total score is updated

// UNIT: DOM Elements:

const containerPlayers = document.querySelector('.players-container');
const containerAddPlayers = document.querySelector('.add__players-container');
const containerAddResetPlayers = document.querySelector(
  '.add_resetplayers-container'
);

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn-close-modal');
const btnOpenModal = document.querySelector('.btn-show-modal');

const nav = document.querySelector('nav');

const labelPlayerName = document.querySelector('player__name');
const labelTotalScore = document.querySelectorAll('.player__score');

const newScoreInput = document.querySelector('.score__input');
const newScoreInputs = document.querySelectorAll('.score__input');

const inputPlayerName = document.querySelector('.player__name-input');

// const btnAddScore = document.querySelector('.form__btn--add-score');

const btnsAddScore = document.querySelectorAll('.form__btn--add-score');
const btnAddPlayer = document.querySelector('.form__btn--add-player');
const btnAddMorePlayers = document.querySelector('.add-more-players');
// const btnResetPlayers = document.querySelector('.reset-players');
const btnLetsPlay = document.querySelector('.lets__play-btn');

// const playerNamesArray = document.querySelectorAll('.player__name');

// UNIT: Show & Hide Modal

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

btnCloseModal.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

btnOpenModal.addEventListener('click', openModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// UNIT:  Default players:

const playerstest = [
  {
    name: 'Cynthia',
    scores: [10, 25, 5, 6],
    totalScore: 0,
  },
  {
    name: 'Brayden',
    scores: [10, 5, 5, 6],
    totalScore: 0,
  },
];

let allPlayers = [];

// UNIT: Data:

//  array of add score btns:
const btnsAddScoreArray = Array.from(btnsAddScore);

// array of inputs:
const newScoreInputsArray = Array.from(newScoreInputs);

// UNIT: Refresh if user confirms:

window.addEventListener('beforeunload', event => {
  event.returnValue = `Are you sure you want to leave?`;
});

// UNIT: Functions

// function to calculate total score
const calcAndDisplayTotalScore = function () {
  allPlayers.forEach(function (player, i) {
    // Calculate each player total score:
    player.scores.reduce((acc, score, i) => (player.totalScore = acc + score));

    // Display Score:
    let scoreDisplays = document.querySelectorAll('.player__score');
    let scoreDisplaysArray = Array.from(scoreDisplays);

    let labelScoresArray = document.querySelectorAll('.scores-array');
    let labelTotalScoreArray = labelScoresArray;

    scoreDisplaysArray[i].textContent = allPlayers[i].totalScore;

    // Add new score to displayed array:
    let displayedScoreArr = player.scores.slice(1).join(', ');
    labelTotalScoreArray[i].textContent = displayedScoreArr;
  });
};

// Add event listener to add new score buttons:
const addNewScore = function () {
  // arrays:
  let scoreInputs = document.querySelectorAll('.score__input');
  let scoreInputsArray = Array.from(scoreInputs);

  let addScoresBtns = document.querySelectorAll('.form__btn--add-score');
  let addScoresBtnsArray = Array.from(addScoresBtns);

  addScoresBtnsArray.forEach(function (btn, i, btnArray) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const newScore = +scoreInputsArray[i].value;

      if (newScore !== 0) {
        allPlayers[i].scores.push(newScore);
        console.log(allPlayers);
      }

      // Display total score:
      calcAndDisplayTotalScore();

      // Emptying input once score is added:
      scoreInputsArray[i].value = '';

      // Display current winner:
      document.querySelector('.winner-container-title').classList.add('hidden');

      const scoresMap = new Map();

      allPlayers.forEach(player => {
        scoresMap.set(player.name, player.totalScore);
      });

      const sortedScoresMap = new Map(
        [...scoresMap.entries()].sort((a, b) => b[1] - a[1])
      );

      const mapIterator = sortedScoresMap.entries();

      const playersOrdered = [];
      const scoresOrdered = [];
      const winnerContainer = document.querySelector('.winner');
      let winners = [];
      const winnerTie = document.querySelector('.winner-tie');
      let winnersTextStart;
      let winnersTextEnd;

      for (const [playerName, score] of mapIterator) {
        playersOrdered.push(playerName);
        scoresOrdered.push(score);
      }

      console.log('players:', playersOrdered, 'scores', scoresOrdered);

      // if there's ties or no ties:
      if (scoresOrdered[0] !== scoresOrdered[1]) {
        winnerTie.classList.add('hidden');
        winnerContainer.innerHTML = `
        <h2><span class="winner-title">${
          playersOrdered[0]
        }</span> is winning with <span class="winner-title">${
          scoresOrdered[0]
        }</span> ${scoresOrdered[0] > 1 ? 'points' : 'point'} 🥳</h2>`;
      }

      if (scoresOrdered[0] === scoresOrdered[1]) {
        winnerContainer.textContent = '';
        winnerTie.classList.remove('hidden');

        scoresOrdered.forEach((score, i, arr) => {
          if (arr[1] === score) {
            winners.push(playersOrdered[i]);
          }
        });

        if (winners.length === 2) {
          winnersTextStart = winners[0];
        }
        if (winners.length > 2) {
          winnersTextStart = winners.slice(0, -1).join(', ');
        }

        console.log('winners are:', winners);
        winnersTextEnd = winners.slice(-1);

        winnerContainer.innerHTML = `<h2><span class="winner-title">${winnersTextStart}</span> and <span class="winner-title">${winnersTextEnd}</span> are tied with a score of <span class="winner-title">${scoresOrdered[0]}</span> 🥳</h2>`;
      }
    });
  });
};

const addPlayers = function () {
  btnAddPlayer.addEventListener('click', function () {
    if (document.querySelector('.player__name-input').value.length > 0) {
      const playerName = document
        .querySelector('.player__name-input')
        .value.toLowerCase();
      let playerObject = {
        name: playerName,
        scores: [0],
        totalScore: 0,
      };

      allPlayers.push(playerObject);
      console.log(playerObject);
      console.log(allPlayers);

      let html;
      allPlayers.forEach(function (curPlayer, i) {
        html = `
      <div class="player__row">
      <div class="player__name-container">
        <p class="player__number-label">Player ${i + 1}</p>
        <div class="player__name">${curPlayer.name}</div>
        <div><p><strong>Scores:  </strong><span class="scores-array"></span></p></div>
      </div>
      <div class="flex-row">
      <div class="score__input-container">
        <input id="" type="number" class="score__input form__input--amount"/>
        <button id="" class="btn form__btn form__btn--add-score">+</button>
      </div>
      <div class="total__score-container">
        <p class="score-label">Score</p>
        <div id="${curPlayer.name}-display-score" class="player__score ${
          curPlayer.name
        }">
        0</div>
      </div>
      </div>
    </div>
    
      `;
      });

      // remove hidden class from container of players:
      containerPlayers.classList.remove('hidden');

      containerPlayers.insertAdjacentHTML('beforeend', html);

      addNewScore();

      // console.log('Children:', containerPlayers.children);

      // Empty new player input on click:
      document.querySelector('.player__name-input').value = '';
    }
  });
};

addPlayers();

// Hide add player container when "Let's Play is clicked:"

btnLetsPlay.addEventListener('click', function (e) {
  if (!containerPlayers.classList.contains('hidden')) {
    containerAddPlayers.classList.add('hidden');
    containerAddResetPlayers.classList.remove('hidden');
  }

  nav.querySelector('p').classList.add('hidden');
});

// Show Add player container when "Add More Players" is clicked:

btnAddMorePlayers.addEventListener('click', function (e) {
  containerAddPlayers.classList.remove('hidden');
  btnLetsPlay.textContent = 'Keep Playing';
  containerAddResetPlayers.classList.add('hidden');
  nav.querySelector('p').classList.remove('hidden');
});
