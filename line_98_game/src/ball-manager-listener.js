import {
//  GAME_CONFIG,
  GAME_STATE,
  BALL_STATE
} from './common.js';



export var BallManagerListener = {
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
