import React from 'react';
import ReactDOM from 'react-dom';


class ResetButton extends React.Component {
  resetGame() {
    alert('Game reseting...');
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

class GameBoard extends React.Component {
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
    return (
      <div style={containerStyle}>
        <div style={gameBoardStyle}>
          <canvas ref={this.onCanvasCreate}>
          </canvas>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <GameBoard />,
  document.getElementById('line98EntryPoint')
);

ReactDOM.render(
  <ResetButton className="reset_button" caption="重置" />,
  document.getElementById('line98ResetButton')
);