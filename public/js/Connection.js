class Connection {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;

    startPoint.connection = this;
    endPoint.connection = this;

    this.updatePosition();
  }

  updatePosition(curveFactor = 0.2) {
    this.a1 = this.startPoint.getPos();
    this.a2 = this.endPoint.getPos();

    let offset =
      curveFactor * Math.hypot(this.a2.x - this.a1.x, this.a2.y - this.a1.y);

    this.c1 = {
      x: this.a1.x + offset,
      y: this.a1.y,
    };

    this.c2 = {
      x: this.a2.x - offset,
      y: this.a2.y,
    };
  }

  B(t) {
    return {
      x:
        this.a1.x * (1 - t) ** 3 +
        this.c1.x * 3 * (1 - t) ** 2 * t +
        this.c2.x * 3 * (1 - t) * t ** 2 +
        this.a2.x * t ** 3,
      y:
        this.a1.y * (1 - t) ** 3 +
        this.c1.y * 3 * (1 - t) ** 2 * t +
        this.c2.y * 3 * (1 - t) * t ** 2 +
        this.a2.y * t ** 3,
    };
  }

  getDistanceFunction(s) {
    return function (t) {
      if (t < 0 || t > 1) return Infinity;

      let P = this.B(t);

      return Math.hypot(P.x - s.x, P.y - s.y);
    };
  }

  draw() {
    push();
    strokeWeight(5);
    stroke("black");
    noFill();
    bezier(
      this.a1.x,
      this.a1.y,
      this.c1.x,
      this.c1.y,
      this.c2.x,
      this.c2.y,
      this.a2.x,
      this.a2.y
    );
    pop();
  }
}

export default Connection;
