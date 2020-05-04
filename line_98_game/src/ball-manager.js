import React from 'react';
import {
  GAME_CONFIG,
  BALL_STATE
} from './common.js';
import { Ball } from './game-board.js';



export var BallManager = {
  createBall(r, c, colourId) {
    const ANI_SPEED = GAME_CONFIG.BALL_MOVING_SPEED * 5;
    let id = r * this.config.dimension + c;
    let sz = this.config.cellSize + this.config.lineWidth;
    let left = c * sz;
    let top = r * sz;
    let animation = "none";
    let animatedIdx = this.state.animatedBalls.indexOf(id);
    let isLast = animatedIdx === this.state.animatedBalls.length - 1;
    let ballManager = isLast ? this : null;

    if (this.ballState === BALL_STATE.MOVING) {
      // @TODO: implement me
    }
    else if (colourId !== 0) {
      switch(this.ballState) {
        case BALL_STATE.GENERATING:
          if (animatedIdx >= 0) {
            animation =
              `ballGenerating${colourId} ${ANI_SPEED}s linear 0s 1 normal`;
          }
        break;

        case BALL_STATE.FOCUSED:
          // @TODO: implement me
        break;

        case BALL_STATE.REMOVING:
          // @TODO: implement me
        break;

        default:
        break;
      }
    }

    return (<Ball
      id={id}
      left={left}
      top={top}
      size={sz}
      colourId={colourId}
      ballManager={ballManager}
      animation={animation}
    />);
  },

  createBalls() {
    let balls = [];
    let i = 0;
    let j = 0;
    for (i = 0; i < this.config.dimension; i++) {
      for (j = 0; j < this.config.dimension; j++) {
        balls[balls.length] = this.createBall(i, j, this.state.balls[i][j]);
      }
    }
    return balls;
  },

  resetGame() {
    this.ballState = BALL_STATE.OPERATING_DONE;
    ///////this.onClick = this.onClick.bind(this);
    let isNew = this.state.balls.length < this.config.dimension;
    let i = 0;
    let j = 0;
    for (i = 0; i < this.config.dimension; i++) {
      if (isNew) {
        this.state.balls[i] = [];
      }
      for (j = 0; j < this.config.dimension; j++) {
        this.state.balls[i][j] = 0;
      }
    }
    this.state.animatedBalls = [];
    this.forceUpdate();
  },

  generateBallsAnimation(balls) {
    if (Array.isArray(balls)) {
      let animatedBalls = [];
      let dimension = this.config.dimension;
      let i = 0;
      let id = 0;
      for (i = 0; i < balls.length; i++) {
        id = balls[i][0];
        let colourId = balls[i][1];
        let r = Math.floor(id / dimension);
        let c = id % dimension;
        this.state.balls[r][c] = colourId;
        animatedBalls[animatedBalls.length] = id;
      }
      this.ballState = BALL_STATE.GENERATING;
      this.setState({
        animatedBalls: animatedBalls
      });
    }
  }
};
