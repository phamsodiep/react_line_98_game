import React from 'react';
import ReactDOM from 'react-dom';


const COLOUR_LIST = [
  null,
  "#00ccff",
  "#ffff00",
  "#33cc33",
  "#0000ff",
  "#cc3300",
  "#ff66ff",
  "#ff9900"
];

class ResetButton extends React.Component {
  resetGame() {
    gameBoardRef.resetGame();
  }

  render() {
    let caption = this.props.caption;
    caption = typeof caption === "string" ? caption : "Reset";
    return (
      <div className={this.props.className} onClick={this.resetGame}>
        {caption}
      </div>
    );
  }
}

class Ball extends React.Component {
  getColourId() {
    return this.props.colourId >= 0 && this.props.colourId <= 7 ?
      this.props.colourId : 0;
  }

  getCellStyle() {
    let thick = 1;
    let cellSize = 50;
    let size = cellSize + thick;

    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "auto",
      position: "absolute",
      width: size,
      height: size,
      left: this.props.left,
      top: this.props.top
    };
  }

  deriveBallStyle(colourId) {
    let thick = 1;
    let cellSize = 50;
    let size = cellSize + thick;
    let ballSize = Math.floor(size * 60.0 / 100.0);

    return {
      display: "block",
      width: ballSize + "px",
      height: ballSize + "px",
      background: COLOUR_LIST[colourId],
      borderRadius: "50%",
      padding: "0px",
      borderWidth: "0px",
      borderStyle: "none",
    };
  }

  onClick = () => {
    if (typeof this.props.onClick === "function") {
      this.props.onClick(this.props.id);
    }
  }

  render() {
    let colourId = this.getColourId();
    let cellStyle = this.getCellStyle();
    let ballStyle = this.deriveBallStyle(colourId);
    ballStyle.animation = this.props.animation;

    return (
      <div style={cellStyle}>
        <div style={ballStyle} onClick={this.onClick}>
        </div>
      </div>
    );
  }
}

class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      balls: [],
      focusedBallId: -1
    };
    this.resetGame();
  }

  onCanvasCreate = (bgImg) => {
    let i = 0;
    let n = 9; // dimension
    let thick = 1;
    let cellSize = 50;
    let width = n * cellSize + thick * (n + thick);

    // Context retrieving and initializing
    bgImg.width = width;
    bgImg.height = width;
    bgImg.style.position = "absolute";
    bgImg.style.left = 0;
    bgImg.style.top = 0;
    let canvasContext = bgImg.getContext("2d");
    canvasContext.translate(0, 0);
    canvasContext.lineWidth = 1;

    // Render board surface
    canvasContext.fillStyle = "#eeeeee";
    canvasContext.fillRect(
      0,
      0,
      width,
      width
    );

    // Render board cells border
    // |  |  |...
    canvasContext.fillStyle = "#000000";
    for (i = 0; i <= n; i++) {
      let x = i * (cellSize + thick);
      canvasContext.fillRect(x, 0, thick, width);
    }
    // =
    for (i = 0; i <= n; i++) {
      let y = i * (cellSize + thick);
      canvasContext.fillRect(0, y, width, thick);
    }
  }

  render() {
    // dimension * cellSize + lineWidth * (dimension + 1)
    let width = 9 * 50 + 1 * (9 + 1);
    let gameBoardStyle = {
      position: "relative",
      width: "100%",
      height: "100%",
      borderWidth: "0px",
      borderStyle: "none",
      margin: "0px 0px 0px 0px",
      padding: "0px 0px 0px 0px"
    };
    let containerStyle = {
      position: "static",
      width: width + "px",
      height: width + "px",
      borderWidth: "0px",
      borderStyle: "none",
      margin: "0px 0px 0px 0px",
      padding: "0px 0px 0px 0px"
    };
    let balls = this.createBalls();

    return (
      <div style={containerStyle}>
        <div style={gameBoardStyle}>
          <canvas ref={this.onCanvasCreate}>
          </canvas>
          {balls}
        </div>
      </div>
    );
  }


  //////////////////////////////////////////////////////////////////////////////
  // BallManager interface
  //////////////////////////////////////////////////////////////////////////////
  onClick = (id) => {
    this.setState((state, props) => ({
      focusedBallId: id
    }));
  }

  resetGame() {
    let dimension = 9;
    let i = 0;
    let j = 0;
    for (i = 0; i < dimension; i++) {
      this.state.balls[i] = [];
      for (j = 0; j < dimension; j++) {
        this.state.balls[i][j] = 1; // cyan colour
      }
    }
    this.forceUpdate();
  }

  createBalls() {
    if (this.state === null) { // this.state is null if resetGame() is not invoked
      return [];
    }
    let dimension = 9;
    let balls = [];
    let i = 0;
    let j = 0;
    for (i = 0; i < dimension; i++) {
      for (j = 0; j < dimension; j++) {
        balls[balls.length] = this.createBall(i, j, this.state.balls[i][j]);
      }
    }
    return balls;
  }

  createBall(r, c, colourId) {
    let dimension = 9;
    let ballId = r * dimension + c;
    let animation = this.state.focusedBallId === ballId ?
      "ballFocused 0.25s linear 0s infinite alternate" : null;
    let thick = 1;
    let cellSize = 50;
    let sz = cellSize + thick;
    let left = c * sz;
    let top = r * sz;

    return (<Ball
      id={ballId}
      left={left}
      top={top}
      colourId={colourId}
      onClick={this.onClick}
      animation={animation}
    />);
  }
}

function initializeAnimationCsses() {
  let cssNode = document.createElement('STYLE');
  let entryPoint = document.getElementById('line98EntryPoint');
  let parentNode = entryPoint.parentNode;
  let cssStr = `
    @keyframes ballFocused {
      from {}
      to {margin-bottom: 15px}
    }
  `;
  cssNode.type = 'text/css';
  cssNode.innerHTML = cssStr;
  cssNode = parentNode.insertBefore(cssNode, entryPoint);
}

initializeAnimationCsses();

var gameBoardRef = ReactDOM.render(
  <GameBoard />,
  document.getElementById('line98EntryPoint')
);

ReactDOM.render(
  <ResetButton className="reset_button" caption="重置" />,
  document.getElementById('line98ResetButton')
);