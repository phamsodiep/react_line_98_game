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

  searchPath(src, des) {
    let dim = this.matrix.length;
    let matrix = this.matrix;
    let r0 = Math.floor(src / dim);
    let c0 = src % dim;
    let r1 = Math.floor(des / dim);
    let c1 = des % dim;
    let myColour = matrix[r0][c0];
    let path = [[r0, c0, -1, 's']];
    let isArrived = function() {
      let i = 0;
      for (i = 0; i < path.length; i++) {
        if (path[i][0] === r1 && path[i][1] === c1) {
          return i;
        }
      }
      return -1;
    }
    let step = 0;
    let getAllOneStepPath = function(step) {
      let result = false;
      let cell = path[step];
      matrix[cell[0]][cell[1]] = -1;
      if (
        cell[0] + 1 < dim
        && matrix[cell[0] + 1][cell[1]] === 0
      ) {  // down
        path[path.length] = [cell[0] + 1, cell[1], step, 'd'];
        result = true;
      }
      if (
        cell[0] - 1 >= 0
        && matrix[cell[0] - 1][cell[1]] === 0
      )  {  // up
        path[path.length] = [cell[0] - 1, cell[1], step, 'u'];
        result = true;
      }
      if (
        cell[1] + 1 < dim
        && matrix[cell[0]][cell[1] + 1] === 0
      ) {  // right
        path[path.length] = [cell[0], cell[1] + 1, step, 'r'];
        result = true;
      }
      if (
        cell[1] - 1 >= 0
        && matrix[cell[0]][cell[1] -1] === 0
      )   {  // left
        path[path.length] = [cell[0], cell[1] - 1, step, 'l'];
        result = true;
      }
      return result;
    }
    let target = 0;
    for (
      target = isArrived();
      target < 0 && step < path.length;
      target = isArrived()
    ) {
      getAllOneStepPath(step++);
    }
    // Remove travel flags
    matrix[r0][c0] = myColour;
    let r = 0;
    let c = 0;
    for (r = 0; r < dim; r++) {
      for (c = 0; c < dim; c++) {
        if (matrix[r][c] === -1) {
          matrix[r][c] = 0;
        }
      }
    }
    if (step < path.length && target >= 0) {
      // a path is found
      let traces = [];
      for (
        step = target;
        path[step][0] !== r0 || path[step][1] !== c0;
        step = path[step][2]
      ) {
        traces[traces.length] = step;
      }
      // include ngoc khoi
      traces[traces.length] = step;
      let result = [];
      let i = 0;
      for(i = traces.length - 1; i >= 0; i--) {
        result[result.length] = path[traces[i]][0] * dim + path[traces[i]][1];
      }
      return result;
    }
    return [];
  }

}
