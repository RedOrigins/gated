import GateInterface from "./GateInterface.js";

class Gate {
  constructor(type, pos, width, height, image, isTemplate = false) {
    this.type = type;
    this.pos = pos;
    this.width = width;
    this.height = height;
    this.image = image;
    this.isTemplate = isTemplate;

    this.interfaces = [];

    switch (type) {
      case "and":
        this.addInterface("in", { x: 0, y: 0.26 });
        this.addInterface("in", { x: 0, y: 0.74 });
        this.addInterface("out", { x: 1, y: 0.5 });
        break;
      case "not":
        this.addInterface("in", { x: 0, y: 0.5 });
        this.addInterface("out", { x: 1, y: 0.5 });
        break;
      case "or":
        this.addInterface("in", { x: 0, y: 0.27 });
        this.addInterface("in", { x: 0, y: 0.73 });
        this.addInterface("out", { x: 1, y: 0.5 });
        break;
      case "xor":
        this.addInterface("in", { x: 0, y: 0.26 });
        this.addInterface("in", { x: 0, y: 0.74 });
        this.addInterface("out", { x: 1, y: 0.5 });
        break;
    }
  }

  evaluate(inputValues) {
    let inputs = this.interfaces.filter(
      (gateInterface) => gateInterface.type == "in"
    );

    let gateInputValues = [];

    inputs.forEach((input) => {
      if (input.connection) {
        gateInputValues.push(input.connection.startPoint.evaluate(inputValues));
      } else {
        gateInputValues.push(false);
      }
    });

    let returnVal;
    switch (this.type) {
      case "and":
        returnVal = gateInputValues[0] && gateInputValues[1];
        break;
      case "or":
        returnVal = gateInputValues[0] || gateInputValues[1];
        break;
      case "xor":
        returnVal =
          (gateInputValues[0] && !gateInputValues[1]) ||
          (!gateInputValues[0] && gateInputValues[1]);
        break;
      case "not":
        returnVal = !gateInputValues[0];
        break;
    }
    return returnVal;
  }

  draw(isDrawingConnection = false) {
    image(this.image, this.pos.x, this.pos.y, this.width, this.height);

    this.interfaces.forEach((gateInterface) => {
      gateInterface.draw(isDrawingConnection);
    });
  }

  addInterface(type, relPos) {
    this.interfaces.push(new GateInterface(type, relPos, this));
  }
}

export default Gate;
