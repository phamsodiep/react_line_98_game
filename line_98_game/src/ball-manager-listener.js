import {
  GAME_CONFIG,
  GAME_STATE,
  BALL_STATE
} from './common.js';



export var BallManagerListener = {
  select(ball) {
    let state = this.gameState.getState();
    let focusedBall = this.gameState.getFocusedBall();
    let isOccupied = this.gameState.isOccupied(ball);
    switch(state) {
      case GAME_STATE.MOVE_WAITING:
        if (isOccupied) {
          if (focusedBall === null) {
            this.ballManager.focusBall(ball);
            this.gameState.setFocusedBall(ball);
            this.gameState.setState(GAME_STATE.FOCUSED);
          }
        }
      break;

      case GAME_STATE.FOCUSED:
        if (isOccupied) {
          if (ball !== focusedBall) {
            this.ballManager.focusBall(ball);
            this.gameState.setFocusedBall(ball);
          }
        }
        else {
          // move request
          let path = this.gameState.searchPath(focusedBall, ball);
          if (path.length > 0) {
            this.gameState.setState(GAME_STATE.BALL_MOVING);
            this.ballManager.moveBallWithAnimation(path);
          }
        }
      break;

      default:
      break;
    }
  },

  animationDone(lastBall) {
    let state = this.gameState.getState();
    switch (state) {
      case GAME_STATE.BALL_GENERATING:
        this.gameState.setState(GAME_STATE.MOVE_WAITING);
        this.ballManager.ballState = BALL_STATE.OPERATING_DONE;
      break;

      case GAME_STATE.BALL_MOVING:
        {
          // Boundary post processing
          let movedBallId = this.ballManager.state.animatedBalls[0];
          let rm = Math.floor(movedBallId / this.ballManager.config.dimension);
          let cm = movedBallId % this.ballManager.config.dimension;
          let movedBallColourId = this.ballManager.state.balls[rm][cm];
          let r = Math.floor(lastBall / this.ballManager.config.dimension);
          let c = lastBall % this.ballManager.config.dimension;
          this.ballManager.state.balls[r][c] = movedBallColourId;
          this.ballManager.state.balls[rm][cm] = 0;
          // GameState post processing
          this.gameState.moveDone(movedBallId, lastBall);

          // Use case implementation
          let removedBalls = this.gameState.doScore(lastBall);
          if (removedBalls.length > 0) {
            this.gameState.setState(GAME_STATE.BALL_SCORING);
            this.ballManager.removeWithAnimation(removedBalls);
            let _this = this;
            setTimeout(function() {
              _this.animationDone(removedBalls[0]);
            }, 2);
          } else {
            let balls =
              this.gameState.generateBalls(GAME_CONFIG.BALL_GENERATING_COUNT);
            this.gameState.setState(GAME_STATE.BALL_GENERATING);
            this.ballManager.generateBallsAnimation(balls);
            let _this = this;
            setTimeout(function() {
              _this.animationDone(balls[balls.length - 1]);
            }, 2);
          }
        }
      break;

      case GAME_STATE.BALL_SCORING:
        // Boundary post processing
        for (let i = 0; i < this.ballManager.state.animatedBalls.length; i++) {
          let rid = this.ballManager.state.animatedBalls[i];
          let r = Math.floor(rid / this.ballManager.config.dimension);
          let c = rid % this.ballManager.config.dimension;
          this.ballManager.state.balls[r][c] = 0;
        }
        this.ballManager.ballState = BALL_STATE.OPERATING_DONE;
        // GameState post processing
        let totalScore = this.gameState.getTotalScore();
        this.scoreBoard.display(totalScore);
        this.gameState.setState(GAME_STATE.MOVE_WAITING);
      break;
      default:
      break;
    }
  }
}
