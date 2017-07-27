const observable = require('../libs/mobx').observable;
const extendObservable = require('../libs/mobx').extendObservable;

let roundStore = function () {
  extendObservable(this, {
    player1: 0,
    player2: 0,
    winner: '',
    finished: false
  });
}

export default roundStore;