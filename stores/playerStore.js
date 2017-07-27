const observable = require('../libs/mobx').observable;
const extendObservable = require('../libs/mobx').extendObservable;

let playerStore = function (name, id) {

  extendObservable(this, {
    name,
    id,
    onGame: true
  });
}

export default playerStore;