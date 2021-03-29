// Abstract Class
class ConnectionPoint {
  constructor(type) {
    // "in" or "out"
    this.type = type;
    // Reference to Connection
    this.connection = undefined;

    this.state = false;
  }

  // Abstract, must be implemented by derived classes
  // getPos(): Position

  draw(isDrawingConnection = false, isTemplate = false) {
    const pos = this.getPos();

    // Draw circle at position
    push();

    if (
      this.type == "in" &&
      isDrawingConnection &&
      !this.connection &&
      !isTemplate
    ) {
      stroke(0, 0, 255);
    } else {
      stroke(0);
    }

    if (this.connection) {
      fill(140);
    } else if (
      Math.hypot(mouseX - pos.x, mouseY - pos.y) < 10 &&
      !isTemplate &&
      ((this.type == "out" && !isDrawingConnection) ||
        (this.type == "in" && isDrawingConnection))
    ) {
      fill(180);
    } else {
      fill(220);
    }

    circle(pos.x, pos.y, 20);
    pop();
  }
}

export default ConnectionPoint;
