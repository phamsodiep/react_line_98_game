import {
  GAME_CONFIG,
  GAME_STATE,
} from './common.js';



export var ResetListener = {
  resetGame() {
    this.gameState.resetGame();
    this.ballManager.resetGame();
    this.scoreBoard.display(0);
    let balls = this.gameState.generateBalls(GAME_CONFIG.BALL_GENERATING_COUNT);
    this.gameState.setState(GAME_STATE.BALL_GENERATING);
    let _this = this;
    setTimeout(function () {
      _this.ballManager.generateBallsAnimation(balls);
    }, 2);
  }
};
