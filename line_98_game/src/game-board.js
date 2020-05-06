import React from 'react';
import {
  GAME_CONFIG,
  deriveGameConfig,
  getGameBoardStyle
} from './common.js';



export class GameBoard extends React.Component {
  constructor(props) {
    super(props);
    this.config = deriveGameConfig(
      50,
      1,
      9
    );
    this.state = {
      animatedBalls: [],
      balls: []
    };
  }

  onCanvasCreate = (elem) => {
    let i = 0;
    let n = this.config.dimension;
    let thick = this.config.lineWidth;
    let cellSize = this.config.cellSize;

    // Context retrieving and initializing
    elem.width = this.config.width;
    elem.height = this.config.height;
    elem.style.position = "absolute";
    elem.style.left = 0;
    elem.style.top = 0;
    this.canvasContext = elem.getContext("2d");
    this.canvasContext.translate(0, 0);
    this.canvasContext.lineWidth = 1;

    // Render board surface
    this.canvasContext.fillStyle = "#eeeeee";
    this.canvasContext.fillRect(
      0,
      0,
      this.config.width,
      this.config.height
    );

    // Render board cells border
    // |  |  |...
    this.canvasContext.fillStyle = "#000000";
    for (i = 0; i <= n; i++) {
      let x = i * (cellSize + thick);
      this.canvasContext.fillRect(x, 0, thick, this.config.height);
    }
    // =
    for (i = 0; i <= n; i++) {
      let y = i * (cellSize + thick);
      this.canvasContext.fillRect(0, y, this.config.width, thick);
    }
  }

  render() {
    let gameBoardStyle = getGameBoardStyle();
    let containerStyle = getGameBoardStyle();
    containerStyle.position = "static";
    containerStyle.width = this.config.width + "px";
    containerStyle.height = this.config.height + "px";
    let balls =
      typeof this.createBalls === "undefined" ? "": this.createBalls();

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
}


export class Ball extends React.Component {
  constructor(props) {
    super(props);
    this.config = {
      ballSize: Math.floor(
        this.props.size * 60.0 / 100.0
      )
    };
  }

  onBallCreate = (elem) => {
    elem.addEventListener(
      "animationstart",
      this.onAnimationStart,
      false
    );
    elem.addEventListener(
      "animationend",
      this.onAnimationEnd,
      false
    );
  }

  getColourId() {
    return this.props.colourId >= 0 && this.props.colourId <= 7 ?
      this.props.colourId : 0;
  }

  getCellStyle() {
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "auto",
      position: "absolute",
      width: this.props.size,
      height: this.props.size,
      left: this.props.left,
      top: this.props.top
    };
  }

  deriveBallStyle(colourId) {
    return {
      display: "block",
      width: this.config.ballSize + "px",
      height: this.config.ballSize + "px",
      background: GAME_CONFIG.COLOUR_LIST[colourId],
      borderRadius: "50%",
      padding: "0px",
      borderWidth: "0px",
      borderStyle: "none",
    };
  }

  onAnimationStart = () => {
  }

  onAnimationEnd = () => {
    if (this.props.ballManager !== null) {
      this.props.ballManager.ballManagerListener.animationDone(this.props.id);
    }
  }

  onClick = () => {
    this.props.onClick(this.props.id);
  }

  render() {
    let colourId = this.getColourId();
    let cellStyle = this.getCellStyle();
    let ballStyle = this.deriveBallStyle(colourId);
    ballStyle.animation = this.props.animation;

    return (
      <div style={cellStyle}>
        <div
          style={ballStyle}
          onClick={this.onClick}
          ref={this.onBallCreate}
        >
        </div>
      </div>
    );
  }
}
