export class ScoreBoard {
  constructor(scoreBoard, prefix) {
    this.scoreBoard = null;
    if (scoreBoard !== null &&
      typeof scoreBoard === "object" &&
      typeof scoreBoard.innerText === "string"
    ) {
      this.scoreBoard = scoreBoard;
    }
    this.prefix = typeof prefix === "string" ? prefix : "";
  }

  display(score) {
    if (this.scoreBoard !== null) {
      this.scoreBoard.innerText = this.prefix + score.toString();
    }
  }
}
