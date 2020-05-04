export const GAME_CONFIG = {
  WIN_PRICE_SCORE:       15,
  BOARD_DIMENSION:       9,
  BALL_MOVING_SPEED:     0.05, // moving step of ball demostration duration
  BALL_GENERATING_COUNT: 3,
  MIN_BALLS_TO_SCORE:    5,
  COLOUR_LIST: [
    null,
    "#00ccff",
    "#ffff00",
    "#33cc33",
    "#0000ff",
    "#cc3300",
    "#ff66ff",
    "#ff9900"
  ]
};

export const GAME_STATE = {
  INITIALIZING:    0,
  BALL_GENERATING: 1,
  MOVE_WAITING:    2,
  FOCUSED:         3,
  BALL_MOVING:     4,
  BALL_SCORING:    5,
  GAME_OVER:       100,
  WIN_PRICE:       101,
};

export const BALL_STATE = {
  INITIALIZING:    0,
  OPERATING_DONE:  1,
  GENERATING:      2,
  FOCUSED:         3,
  MOVING:          4,
  REMOVING:        5
};



export function deriveGameConfig(cellSize, lineWidth, dimension) {
  let cellSz = typeof cellSize  === "number" ? cellSize  : 50;
  let dim = typeof dimension === "number" ? dimension : 9;
  let lineW = typeof lineWidth === "number" ?
    (lineWidth % 2 === 0 ? lineWidth + 1 : lineWidth) : 1;
  let width = dim * cellSz + lineW *(dim + 1);
  return {
    cellSize: cellSz,
    lineWidth: lineW,
    dimension: dim,
    width: width,
    height: width
  };
}

export function getGameBoardStyle() {
  return {
    position: "relative",
    width: "100%",
    height: "100%",
    borderWidth: "0px",
    borderStyle: "none",
    margin: "0px 0px 0px 0px",
    padding: "0px 0px 0px 0px"
  };
}
