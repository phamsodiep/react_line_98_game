import {
  GAME_STATE
} from './common.js';



export class GameState {
  constructor(dimension) {
    let matrix = [];
    let i = 0;
    let j = 0;
    for (i = 0; i < dimension; i++) {
      let row = [];
      for (j = 0; j < dimension; j++) {
        row[row.length] = 0;
      }
      matrix[matrix.length] = row;
    }
    this.cellCount = dimension * dimension;
    this.matrix = matrix;
    this.gameState = GAME_STATE.INITIALIZING;
    this.focusedBall = null;
  }

  isOccupied(ball) {
    let dimension = this.matrix.length;
    let r = Math.floor(ball / dimension);
    let c = ball % dimension;
    return (this.matrix[r][c] !== 0);
  }

  getState() {
    return this.gameState;
  }

  setState(state) {
    this.gameState = state;
    return true;
  }

  getFocusedBall() {
    return this.focusedBall;
  }

  setFocusedBall(ball) {
    this.focusedBall = ball;
  }

  resetGame() {
    let dimension = this.matrix.length;
    let i = 0;
    let j = 0;
    for (i = 0; i < dimension; i++) {
      for (j = 0; j < dimension; j++) {
        this.matrix[i][j] = 0;
      }
    }
    this.gameState = GAME_STATE.INITIALIZING;
  }

  getCellColourIndex(id) {
    let dimension = this.matrix.length;
    if (id >= this.cellCount) {
      return 0;
    }
    let r = Math.floor(id / dimension);
    let c = id % dimension;
    return this.matrix[r][c];
  }

  generateBallPosition() {
    let maxIdx = this.cellCount;
    let idx = 0;
    // re-generate because cell is occupied
    for (
      idx = Math.floor(Math.random() * maxIdx);
      this.getCellColourIndex(idx) !== 0;
      idx = Math.floor(Math.random() * maxIdx)
    );
    return idx;
  }

  generateBalls(count) {
    let dimension = this.matrix.length;
    let balls = Array(count);
    let i = 0;
    let idx = 0;
    for (i = 0; i < count; i++) {
      idx = this.generateBallPosition();
      let colourId = Math.floor(Math.random() * 7) + 1;
      // Generate ball cheat code for debug purpose
      /*if (document.getElementById('genCheat') !== null && i === 0) {
        let txts = document.getElementById('genCheat').value.split(" ");
        if (txts.length == 2) {
          idx = parseInt(txts[0]);
          colourId = parseInt(txts[1]);
        }
      }*/
      let j = 0;
      for (j = i - 1; j >= 0; j--) {
        if (idx === balls[j][0]) {
          // re-generate because of duplicated position
          idx = this.generateBallPosition();
          j = i - 1;
        }
      }
      balls[i] = [idx, colourId];
      let r = Math.floor(idx / dimension);
      let c = idx % dimension;
      this.matrix[r][c] = colourId;
    }
    return balls;
  }
}
