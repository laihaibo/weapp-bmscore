const mobx = require('../libs/mobx');
const extendObservable = require('../libs/mobx').extendObservable;
const computed = require('../libs/mobx').computed;
const toJS = require('../libs/mobx').toJS;
const action = require('../libs/mobx').action;

import player from './playerStore';
import game from './gameStore';
import round from './roundStore';

import {getRoundWinner, getGameWinner} from '../utils/compareScore';

let store = function () {
  extendObservable(this, {
    players: [
    ],
    games: [],
    currentGame: {},
    hidden: {
      showAddGame: true,
      showCurrentGame: false,
      showAddScore: false
    },
    filter:0,
    get filters() {
      return [{name:'全部',id:0},...toJS(this.players)];
    },
    get filterGames() {
      let filter = this.filter;
      let players = toJS(this.players).reduce((prev,cur) => {
        prev[cur.id] = cur.name;
        return prev;
      },[]);
      
      return filter === 0 ? this.games.map(game => {
        game.player1Name = players[game.player1];
        game.player2Name = players[game.player2];
        game.winnerName = game.winner ? players[game.winner] : '';
        return game;
      }) : this.games.filter(game => (game.player1 ===filter ||game.player2===filter)).map(game => {
        game.player1Name = players[game.player1];
        game.player2Name = players[game.player2];
        game.winnerName = game.winner ? players[game.winner] : '';
        return game;
      });
    },
    get onGamePlayers() {
      return this
        .players
        .filter(player => player.onGame)
    },
    get playerCount() {
      return this.players.length
    },
    get currentPlayers() {
      let player1Id = parseInt(this.currentGame.player1, 10);
      let player2Id = parseInt(this.currentGame.player2, 10);
      let player1 = this
        .players
        .filter(player => player.id === player1Id)[0];
      let player2 = this
        .players
        .filter(player => player.id === player2Id)[0];

      return [player1, player2];
    },

    get currentStore() {
      let {players,games,currentGame,hidden,filter} = toJS(this);
      return {players,games,currentGame,hidden,filter};
    }
  });

  this.addPlayer = name => {
    let len = this.players.length;
    let id = len === 0
      ? 1
      : this.players[len - 1].id + 1;
    this
      .players
      .push(new player(name, id));
  }

  this.startNewGame = (player1, player2) => {
    let len = this.games.length;
    let id = len === 0
      ? 0
      : this.games[len - 1].id + 1;
    let newGame = new game(player1, player2, id);
    this.currentGame = newGame;
    this
      .games
      .push(newGame);
    this.hidden = {
      showAddGame: false,
      showCurrentGame: true,
      showAddScore: true,
      disableAddScore: false
    }
  }

  this.startNewRound = () => {
    this
      .currentGame
      .rounds
      .push(new round());
    this.updataGame();
  }

  this.addScore = (player) => {
    let rounds = this.currentGame.rounds;
    let len = rounds.length;
    let getScoreOne = `player${player}`;
    let curRound = rounds[len - 1];
    if (curRound.finished) {
      console.log('已结束')
    } else {
      this.currentGame.rounds[len - 1][getScoreOne]++;
      let roundWinner = getRoundWinner(this.currentGame.rounds[len - 1]);
      if (roundWinner) {
        this.currentGame.rounds[len - 1].finished = true;
        this.currentGame.rounds[len - 1].winner = roundWinner;
        let gameWinner = getGameWinner(this.currentGame);
        if (gameWinner) {
          this.currentGame.finished = true;
          this.currentGame.winner = gameWinner;
          console.log(this.currentPlayers)
          let that = this;
          wx.showModal({
            title: '比赛结束',
            content: `恭喜${this.currentPlayers[gameWinner - 1].name}赢得比赛！！！
            是否再来一局？`,
            success: function (res) {
              if (res.confirm) {
                // console.log(this.hidden);
                that.hidden = {
                  showAddGame: true,
                  showCurrentGame: false,
                  showAddScore: false,
                  disableAddScore: true
                }
              } else if (res.cancel) {
                that.hidden = {
                  showAddGame: true,
                  showCurrentGame: true,
                  showAddScore: true,
                  disableAddScore: true
                }
              }
            }
          })
        } else {
          this.startNewRound();
        }
      }
    }
    this.updataGame();
  }

  this.updataGame = () => {
    let len = toJS(this.games).length;
    this.games[len - 1] = toJS(this.currentGame);
  }

  this.giveUpGame = () => {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否放弃比赛',
      success: function (res) {
        if (res.confirm) {
          that.currentGame = {};
          let len = that.games.length;
          that.games= that.games.slice(0,-1);
          that.hidden = {
            showAddGame: true,
            showCurrentGame: false,
            showAddScore: false,
            disableAddScore: true
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  this.removePlayer = (id) => {
    let players = toJS(this.players);
    players = players.map(player => {
      if (player.id === id) {
        player.onGame = false;
        return player
      } else {
        return player
      }
    })
    // console.log(id); console.log(players);
    this.players = players;
  }

  this.setFilter = (filter) => {
    this.filter = filter;
  }

  this.formStorageToStore = ({players,games,currentGame,hidden,filter}) => {
    this.players = players;
    this.games = games;
    this.currentGame = currentGame;
    this.hidden = hidden;
    this.filter = filter;
  }

  this.fromStoreToStorage = () => {
    
  }
}

export default store;