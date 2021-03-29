import Gate from "./Gate.js";
import InputOutput from "./InputOutput.js";
import Connection from "./Connection.js";

const buffer = 20;
const gateScaleFactor = 0.8;

const holderElementId = "sketch-holder";
let canvas;

let gateImages = {};

let gates = [];
let inputOutputs = [];
let connections = [];

let selectedGate;
let mouseOffset = {
  x: 0,
  y: 0,
};

let currentDrawingConnection;
const fakeConnPoint = {
  getPos: function () {
    return {
      x: mouseX,
      y: mouseY,
    };
  },
};

let circuitOutput;

function setup() {
  canvas = createCanvas(1200, 800);
  canvas.parent(holderElementId);

  gateImages = {
    and: loadImage("/images/Gate_AND.png"),
    not: loadImage("/images/Gate_NOT.png"),
    or: loadImage("/images/Gate_OR.png"),
    xor: loadImage("/images/Gate_XOR.png"),
  };

  gates.push(
    new Gate("and", { x: 40, y: 640 }, 240, 134, gateImages.and, true),
    new Gate("not", { x: 340, y: 646 }, 186, 116, gateImages.not, true),
    new Gate("or", { x: 580, y: 640 }, 250, 136, gateImages.or, true),
    new Gate("xor", { x: 870, y: 640 }, 266, 134, gateImages.xor, true)
  );

  circuitOutput = new InputOutput("in", { x: 1150, y: 300 }, "Q");

  inputOutputs.push(
    new InputOutput("out", { x: 80, y: 100 }, "A"),
    new InputOutput("out", { x: 80, y: 300 }, "B"),
    new InputOutput("out", { x: 80, y: 500 }, "C"),
    circuitOutput
  );
}

function draw() {
  background(220);
  stroke(0);
  line(0, 620, width, 620);
  line(310, 620, 310, height);
  line(550, 620, 550, height);
  line(850, 620, 850, height);

  if (selectedGate) {
    selectedGate.pos = {
      x: clamp(
        mouseX - mouseOffset.x,
        buffer,
        width - selectedGate.width - buffer
      ),
      y: clamp(
        mouseY - mouseOffset.y,
        buffer,
        height - selectedGate.height - buffer
      ),
    };

    selectedGate.interfaces.forEach((gateInterface) => {
      if (gateInterface.connection) {
        gateInterface.connection.updatePosition();
      }
    });
  }

  if (currentDrawingConnection) {
    currentDrawingConnection.updatePosition();
  }

  connections.forEach((connection) => {
    connection.draw();
  });

  gates.forEach((gate) => {
    gate.draw(currentDrawingConnection ? true : false);
  });

  inputOutputs.forEach((inputOutput) => {
    inputOutput.draw(currentDrawingConnection ? true : false);
  });
}

function mousePressed() {
  let clickedOnSomething = false;

  inputOutputs.forEach((inputOutput) => {
    if (clickedOnSomething) return;

    if (
      Math.hypot(inputOutput.pos.x - mouseX, inputOutput.pos.y - mouseY) < 10 &&
      !inputOutput.connection &&
      inputOutput.type == "out"
    ) {
      clickedOnSomething = true;
      currentDrawingConnection = new Connection(inputOutput, fakeConnPoint);
      connections.push(currentDrawingConnection);
      inputOutput.connection = currentDrawingConnection;
    }
  });

  gates.forEach((gate) => {
    if (clickedOnSomething) return;

    gate.interfaces.forEach((gateInterface) => {
      const pos = gateInterface.getPos();

      if (
        Math.hypot(pos.x - mouseX, pos.y - mouseY) < 10 &&
        !gateInterface.connection &&
        gateInterface.type == "out" &&
        !gate.isTemplate
      ) {
        clickedOnSomething = true;
        currentDrawingConnection = new Connection(gateInterface, fakeConnPoint);
        connections.push(currentDrawingConnection);
        gateInterface.connection = currentDrawingConnection;
      }
    });

    if (clickedOnSomething) return;

    if (
      mouseX > gate.pos.x &&
      mouseX < gate.pos.x + gate.width &&
      mouseY > gate.pos.y &&
      mouseY < gate.pos.y + gate.height
    ) {
      clickedOnSomething = true;

      mouseOffset = {
        x: mouseX - gate.pos.x,
        y: mouseY - gate.pos.y,
      };

      if (gate.isTemplate) {
        selectedGate = new Gate(
          gate.type,
          { x: mouseX - mouseOffset.x, y: mouseY - mouseOffset.y },
          gate.width * gateScaleFactor,
          gate.height * gateScaleFactor,
          gate.image
        );
        gates.push(selectedGate);
      } else {
        selectedGate = gate;
      }
    }
  });
}

function mouseReleased() {
  if (selectedGate) {
    if (selectedGate.pos.y > 620 - selectedGate.height) {
      selectedGate.pos.y = 600 - selectedGate.height;
      selectedGate.interfaces.forEach((gateInterface) => {
        if (gateInterface.connection) {
          gateInterface.connection.updatePosition();
        }
      });
    }

    selectedGate = undefined;
  }

  if (currentDrawingConnection) {
    let isConnected = false;
    inputOutputs.forEach((inputOutput) => {
      if (isConnected) return;

      if (
        Math.hypot(inputOutput.pos.x - mouseX, inputOutput.pos.y - mouseY) <
          10 &&
        !inputOutput.connection &&
        inputOutput.type == "in"
      ) {
        currentDrawingConnection.endPoint = inputOutput;
        inputOutput.connection = currentDrawingConnection;
        isConnected = true;
      }
    });

    gates.forEach((gate) => {
      if (isConnected || gate.isTemplate) return;

      gate.interfaces.forEach((gateInterface) => {
        const pos = gateInterface.getPos();

        if (
          Math.hypot(pos.x - mouseX, pos.y - mouseY) < 10 &&
          !gateInterface.connection &&
          gateInterface.type == "in"
        ) {
          currentDrawingConnection.endPoint = gateInterface;
          gateInterface.connection = currentDrawingConnection;
          isConnected = true;
        }
      });
    });

    currentDrawingConnection.updatePosition();

    if (!isConnected) {
      connections.splice(connections.indexOf(currentDrawingConnection), 1);
      currentDrawingConnection.startPoint.connection = undefined;
    }

    currentDrawingConnection = undefined;
  }
}

function keyPressed() {
  if (keyCode === 46) {
    let haveDeletedElement = false;

    gates.forEach((gate) => {
      if (haveDeletedElement) return;

      if (
        mouseX > gate.pos.x &&
        mouseX < gate.pos.x + gate.width &&
        mouseY > gate.pos.y &&
        mouseY < gate.pos.y + gate.height &&
        !gate.isTemplate
      ) {
        gate.interfaces.forEach((gateInterface) => {
          if (gateInterface.connection) {
            if (gateInterface.type == "in") {
              gateInterface.connection.startPoint.connection = undefined;
            } else {
              gateInterface.connection.endPoint.connection = undefined;
            }
            connections.splice(
              connections.indexOf(gateInterface.connection),
              1
            );
          }
        });

        gates.splice(gates.indexOf(gate), 1);
        haveDeletedElement = true;
      }
    });

    connections.forEach((connection) => {
      if (haveDeletedElement) return;

      const distanceFunction = connection
        .getDistanceFunction({ x: mouseX, y: mouseY })
        .bind(connection);
      const res = fmin.nelderMead(distanceFunction, [0.5]);

      if (res.fx < 5) {
        connection.startPoint.connection = undefined;
        connection.endPoint.connection = undefined;
        connections.splice(connections.indexOf(connection), 1);
        haveDeletedElement = true;
      }
    });
  }
}

function clamp(val, min, max) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

function evaluate(inputValues = {}) {
  return circuitOutput.evaluate(inputValues);
}

function submit() {
  let res = [];
  let isCorrect = true;
  for (let i = 0; i < 1 << 3; i++) {
    const inputs = [!!(i & (1 << 2)), !!(i & (1 << 1)), !!(i & 1)];

    const Q = evaluate({ A: inputs[0], B: inputs[1], C: inputs[2] });
    const dQ = taskData[inputs[0]][inputs[1]][inputs[2]];

    if (Q != dQ) isCorrect = false;

    res.push({
      A: inputs[0],
      B: inputs[1],
      C: inputs[2],
      Q,
      dQ,
    });

    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/tasks/${taskId}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(
      JSON.stringify({
        state: isCorrect ? "correct" : "incorrect",
      })
    );
    xhr.onreadystatechange = function () {
      window.close();
    };
  }
  console.table(res);
  console.log(`Correct: ${isCorrect}`);
}

window.setup = setup;
window.draw = draw;
window.mousePressed = mousePressed;
window.mouseReleased = mouseReleased;
window.keyPressed = keyPressed;
window.submit = submit;
