export default class Vector {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector) {
        this.x += v.x;
        this.y += v.y;
        return new Vector(this.x + v.x, this.y + v.y);
    }

    sub(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mult(n: number) {
        return new Vector(this.x * n, this.y * n);
    }

    div(n: number) {
        this.x /= n;
        this.y /= n;
        return new Vector(this.x / n, this.y / n);
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    static dist(v1: Vector, v2: Vector) {
        return v1.sub(v2).mag();
    }

    static lerp(start: Vector, end: Vector, amt: number) {
        return new Vector(start.x + (end.x - start.x) * amt, start.y + (end.y - start.y) * amt);
    }

    static angleVectorDifference(angle: number, vector: Vector) {
        // Create a vector representing the car's direction
        let carDirection = new Vector(Math.cos(angle), Math.sin(angle));

        // Normalize the vectors
        let vNormalized = vector.copy().normalize();
        let carDirectionNormalized = carDirection.normalize()

        // Calculate the dot product of the vectors
        let dotProduct = vNormalized.dot(carDirectionNormalized);

        // return the angle between the vectors
        return Math.acos(dotProduct);
    }

    static rotatePoint(point: Vector, origin: Vector, angle: number) {
        let rotatedX = Math.cos(angle) * (point.x - origin.x) - Math.sin(angle) * (point.y - origin.y) + origin.x;
        let rotatedY = Math.sin(angle) * (point.x - origin.x) + Math.cos(angle) * (point.y - origin.y) + origin.y;
        return new Vector(rotatedX, rotatedY);
    }

    normalize() {
        let m = this.mag();
        if (m !== 0) {
            this.div(m);
        }
        return this;
    }

    dot(v: Vector) {
        return this.x * v.x + this.y * v.y;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    static sub(end: Vector, start: Vector) {
        return new Vector(end.x - start.x, end.y - start.y);
    }

    static add(start: Vector, mult: any) {
        return new Vector(start.x + mult.x, start.y + mult.y);
    }
}
