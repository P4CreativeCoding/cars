// Update the score
import Vector from "../../utils/Vector";

class Score {

    highScore: number;
    driftScore: number;
    driftBoard: number[];
    frameScore: number;
    driftCount: number;
    frameScoreHistory: number[] = [];
    curveScore: number;

    constructor(frameScore = 0, totalScore = 0, driftScore = 0) {
        this.frameScore = frameScore;
        this.highScore =   totalScore;
        this.driftScore = driftScore;

    }

    update(velocity: Vector, angle: number) {
        let angleDifference = Vector.angleVectorDifference(angle, velocity);

        // Calculate the score based on the angle difference and the velocity
        this.frameScore = (1 - Math.sin(angleDifference)) * velocity.mag();
        // console.log('frameScore', this.frameScore)
        this.driftScore += this.frameScore;
        this.curveScore += this.frameScore;
        this.pushFrameScore(this.frameScoreHistory, this.frameScore);
    }

    pushFrameScore(frameScoreHistory, frameScore: number) {
        frameScoreHistory.push(frameScore);
        if (frameScoreHistory.length > 10) {
            frameScoreHistory.shift();
        }
    }

    getFrameScoreAverage(range: number) {
        let sum = 0;
        for (let i = 0; i < range; i++) {
            sum += this.frameScoreHistory[i];
        }
        return sum / range;

    }


    endDrift() {
        if (this.driftScore > this.highScore)
            this.highScore = this.driftScore;
        this.driftScore = 0;
    }

    resetScore() {
        this.endDrift()
        this.highScore = 0;
    }
}

export default Score;