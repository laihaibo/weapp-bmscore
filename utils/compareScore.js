const compareScore = (max, min) => {
  if (max >= 21) {
    if (max < 30) {
      return max - min >= 2 ?
        true :
        false;
    } else {
      return max - min >= 1 ?
        true :
        false;
    }
  } else {
    return false;
  }
}

const compareMostOne = (win) => {
  let player1 = win.filter(n => n === 1).length;
  let player2 = win.filter(n => n === 2).length;

  return player1 > player2 ? 1 : 2;
}

export const getRoundWinner = ({
  player1,
  player2
}) => {
  const maxOne = Math.max(player1, player2);
  const minOne = Math.min(player1, player2);

  let result = compareScore(maxOne, minOne);
  return result ?
    (maxOne === player1 ?
      1 :
      2) :
    false;
};


export const getGameWinner = ({
  rounds
}) => {
  let win = rounds.filter(round => round.finished).map(round => round.winner);
  return win.length === 3 ? compareMostOne(win) : false;
}