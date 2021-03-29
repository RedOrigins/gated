import ConnectionPoint from "./ConnectionPoint.js";

class InputOutput extends ConnectionPoint {
  constructor(type, pos, label) {
    super(type);
    this.pos = pos;
    this.label = label;
  }

  evaluate(inputValues) {
    if (this.type == "out") {
      if (this.label in inputValues) {
        this.state = inputValues[this.label];
      } else {
        this.state = false;
      }
    } else {
      if (this.connection) {
        this.state = this.connection.startPoint.evaluate(inputValues);
      } else {
        this.state = false;
      }
    }

    return this.state;
  }

  getPos() {
    return this.pos;
  }

  draw(isDrawingConnection = false) {
    super.draw(isDrawingConnection);

    push();
    textSize(32);
    fill(30);
    if (this.type == "out") {
      text(this.label, this.pos.x - 45, this.pos.y + 10);
    } else {
      text(this.label, this.pos.x + 15, this.pos.y + 10);
    }
    pop();
  }
}

export default InputOutput;
