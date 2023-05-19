class Car {
    constructor(x = width / 2, y = height / 2, angle = 0) {

        // Turning parameters. Tune these as you see fit.
        this.turnRateStatic =
            0.06; // The normal turning-rate (static friction => not sliding)
        this.turnRateDynamic = 0.05;         // The turning-rate when drifting
        this.turnRate = this.turnRateStatic; // initialise turn-rate
        this.gripStatic = .8;                 // sliding friction while gripping
        this.gripDynamic = 0.1;              // sliding friction while drifting
        this.DRIFT_CONSTANT = 1.7; // sets the x-velocity threshold for no-drift <=>
        // drift. Lower = drift sooner

        // Physical properties
        this.d = createVector(x, y); // displacement (position)
        this.v = createVector(0, 0); // velocity (world-referenced)
        this.a = createVector(0, 0); // acceleration (world-referenced)
        this.angle = angle;          // heading - the direction the car faces
        this.m = 10;                 // mass
        this.w = 18;                 // width of body (for animation)
        this.l = 30;                 // length of body (for animation)
        this.f = 0.06;               // Acceleration / braking force
        this.isDrifting = false;     // Drift state

        // Colour variable - in an example the car colour changes when it loses
        // traction
        this.col = color(255, 255, 255);
        this.id = "";
        this.trail = [];
        this.targetPosition = null;
        this.targetAngle = null;
    }

    /*******************************************************************************
     *  Safely read car variables
     ******************************************************************************/
    getPos() {
        return {x: this.d.x, y: this.d.y, z: this.d.z}
    }

    isDrift() {
        return this.isDrifting;
    }

    getAngle() {
        return this.angle;
    }

    setAngle(angle) {
        this.angle = angle;
    }

    setTrail(trail) {
        this.trail = trail;
    }

    getTrail() {
        return this.trail;
    }

    show() {
        rectMode(CENTER);
        // Centre on the car, rotate
        push();
        translate(this.d.x, this.d.y);
        rotate(this.angle);
        stroke(0);
        strokeWeight(1);
        fill(this.col);
        rect(0, 0, this.w, this.l); // Car body
        rect(0, this.l / 2, 4, 4);  // Indicate front side
        pop();
    }

    update() {
        // Add input forces
        if (keyIsPressed) {
            // ACCELERATING (BODY-FIXED to WORLD)
            if (keyIsDown(UP_ARROW)) {
                let bodyAcc = createVector(0, this.f);
                let worldAcc = this.vectBodyToWorld(bodyAcc, this.angle);
                this.a.add(worldAcc);
            }
            // BRAKING (BODY-FIXED TO WORLD)
            if (keyIsDown(DOWN_ARROW)) {
                let bodyAcc = createVector(0, -this.f);
                let worldAcc = this.vectBodyToWorld(bodyAcc, this.angle);
                this.a.add(worldAcc);
            }
            if (keyIsDown(LEFT_ARROW)) {
                this.angle -= this.turnRate;
            }
            if (keyIsDown(RIGHT_ARROW)) {
                this.angle += this.turnRate;
            }
        }

        // Car steering and drifting physics

        // Rotate the global velocity vector into a body-fixed one. x = sideways
        // velocity, y = forward/backwards
        let vB = this.vectWorldToBody(this.v, this.angle);

        let bodyFixedDrag;
        let grip;
        if (abs(vB.x) < this.DRIFT_CONSTANT) {
            // Gripping
            grip = this.gripStatic
            this.turnRate = this.turnRateStatic;
            this.isDrifting = false;
        } else {
            // Drifting
            grip = this.gripDynamic;
            this.turnRate = this.turnRateDynamic;
            this.isDrifting = true;
        }
        bodyFixedDrag = createVector(vB.x * -grip, vB.y * 0.05);

        // Rotate body fixed forces into world fixed and add to acceleration
        let worldFixedDrag =
            this.vectBodyToWorld(bodyFixedDrag, this.angle)
        this.a.add(
            worldFixedDrag.div(this.m)); // Include inertia

        // Physics Engine
        this.angle = this.angle % TWO_PI; // Restrict angle to one revolution
        this.v.add(this.a);
        this.d.add(this.v);
        this.a = createVector(0, 0); // Reset acceleration for next frame

    }

    interpolate() {

        if (this.targetPosition) {
            let distance = dist(this.d.x, this.d.y, this.targetPosition.x, this.targetPosition.y);
            // if difference is too large, just teleport
            if (distance > 500) {
                this.d = createVector(this.targetPosition.x, this.targetPosition.y);
                this.targetPosition = null;
            } else {
                let targetPos = createVector(this.targetPosition.x, this.targetPosition.y);
                this.d = p5.Vector.lerp(this.d, targetPos, 0.1);
            }
            if (distance < 1) {
                this.targetPosition = null;
            }
        }
        if (this.targetAngle !== null) {
            let difference = this.targetAngle - this.angle;
            while (difference < -Math.PI) difference += Math.PI * 2;
            while (difference > Math.PI) difference -= Math.PI * 2;

            if (Math.abs(difference) > Math.PI / 2) {
                this.angle = this.targetAngle;
                this.targetAngle = null;
            } else {
                let turnDirection = difference > 0 ? 1 : -1;
                this.angle += this.turnRate * turnDirection;
                if (Math.abs(this.targetAngle - this.angle) < this.turnRate) {
                    this.angle = this.targetAngle;
                    this.targetAngle = null;
                }
            }
        }
    }

    /*******************************************************************************
     * Rotation Matrices
     *   Rotate a vector from one frame of reference to the other.
     ******************************************************************************/

    // Body to world rotation
    vectBodyToWorld(vect, ang) {
        let v = vect.copy();
        let vn = createVector(v.x * cos(ang) - v.y * sin(ang),
            v.x * sin(ang) + v.y * cos(ang));
        return vn;
    }

    // World to body rotation
    vectWorldToBody(vect, ang) {
        let v = vect.copy();
        let vn = createVector(v.x * cos(ang) + v.y * sin(ang),
            v.x * sin(ang) - v.y * cos(ang));
        return vn;
    }

    setPosition(position) {
        this.d = position;
    }

    setDrift(drifting) {
        this.isDrifting = drifting;
    }
}
