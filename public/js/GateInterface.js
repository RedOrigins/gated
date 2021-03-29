import ConnectionPoint from "./ConnectionPoint.js";

class GateInterface extends ConnectionPoint {
  constructor(type, relPos, gate) {
    super(type);
    this.relPos = relPos;
    this.gate = gate;
  }

  evaluate(inputValues) {
    if (this.type == "out") {
      this.state = this.gate.evaluate(inputValues);
    } else {
      if (this.connection) {
        this.state = this.connection.startPoint.evaluate(inputValues);
      } else {
        this.state = false;
      }
    }
    return this.state;
  }

  draw(isDrawingConnection = false) {
    super.draw(isDrawingConnection, this.gate.isTemplate);
  }

  getPos() {
    return {
      x: this.gate.pos.x + this.gate.width * this.relPos.x,
      y: this.gate.pos.y + this.gate.height * this.relPos.y,
    };
  }
}

export default GateInterface;
