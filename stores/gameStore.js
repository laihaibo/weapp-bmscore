const observable = require('../libs/mobx').observable;
const extendObservable = require('../libs/mobx').extendObservable;

let gameStore = function (player1, player2, id) {

  extendObservable(this, {
    player1,
    player2,
    id,
    finished: false,
    winner: '',
    rounds: [
      {
        player1: 0,
        player2: 0,
        finished: false,
        winner: ''
      }
    ]
  });
}

export default gameStore;