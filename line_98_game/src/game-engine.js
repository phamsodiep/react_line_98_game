export class GameEngine {
  constructor(gameState, ballManager, scoreBoard, callBack) {
    let nullFunc = function(totalScore) {
      alert(`You won price with score ${totalScore}!`);
    };
    this.gameState = gameState;
    this.ballManager = ballManager;
    this.scoreBoard = scoreBoard;
    this.onWinPrice = typeof callBack === "function" ? callBack : nullFunc;
  }
}
