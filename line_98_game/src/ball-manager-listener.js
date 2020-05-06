import {
//  GAME_CONFIG,
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

      default:
      break;
    }
  }
}
