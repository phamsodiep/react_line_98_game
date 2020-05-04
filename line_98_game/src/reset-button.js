import React from 'react';



export class ResetButton extends React.Component {
  constructor(props) {
    super(props);
    let resetListener = this.props.resetListener;
    if (
      typeof resetListener != "undefined" &&
      typeof resetListener.resetGame != "undefined"
    ) {
      this.resetGame = resetListener.resetGame.bind(resetListener);
    }
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
