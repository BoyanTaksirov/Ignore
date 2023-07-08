const TARGET_STATES = require("../globals").TARGET_STATES;
const TARGET_TYPES = require("../globals").TARGET_TYPES;
const MARK_TYPES = require("../globals").MARK_TYPES;
const TIME_UP_ANIM_TIME_MSEC = require("../globals").TIME_UP_ANIM_TIME_MSEC;
const RIGHT_HIT_ANIM_TIME_MSEC = require("../globals").RIGHT_HIT_ANIM_TIME_MSEC;
const WRONG_HIT_ANIM_TIME_MSEC = require("../globals").WRONG_HIT_ANIM_TIME_MSEC;
const TARGET_ANGLE_STEP_DEG = require("../globals").TARGET_ANGLE_STEP_DEG;
const MAX_STEP_FACTOR = require("../globals").MAX_STEP_FACTOR;
const MIN_STEP_FACTOR = require("../globals").MIN_STEP_FACTOR;
const GAME_STATES = require("../globals").GAME_STATES;
const MAX_TIME_NEXT_TRAJECTORY_MSEC = require("../globals").MAX_TIME_NEXT_TRAJECTORY_MSEC;
const MIN_TIME_NEXT_TRAJECTORY_MSEC = require("../globals").MIN_TIME_NEXT_TRAJECTORY_MSEC;
const degreesToRadians = require("../globals").degreesToRadians;
const radiansToDegrees = require("../globals").radiansToDegrees;

module.exports = class GameTarget {
    constructor(type, imagesUrl, levelConfig, coords, createNewMark, onTargetHit, onTargetTimeUp, willMove, 
        targetStep = TARGET_ANGLE_STEP_DEG, getGameState, id = "NO ID SET") {
        this.type = type;
        this.imagesUrl = imagesUrl;
        this.levelConfig = levelConfig;
        this.createNewMark = createNewMark;
        this.onTargetHit = onTargetHit;
        this.onTargetTimeUp = onTargetTimeUp;
        this.willMove = willMove;
        this.targetStep = targetStep;
        this.getGameState = getGameState;
        this.id = id;

        this.inMove = willMove;  // TODO eventually, if we need to start and stop the movement

        this.emergeTimestamp = new Date();
        this.hitTimestamp;
        this.waitTimestamp;
        this.waitOverTimestamp;

        this.currentAngle;
        this.inMove = false;
        this.stepFactor;
        this.trajectoryTimestamp;
        this.timeMSecToNextTrajectory;
        this.xInvert = 1;
        this.yInvert = 1;

        this.targetState = TARGET_STATES.TARGET_EMERGE;

        this.clicked = false;

        this.onTargetClick = this.onTargetClick.bind(this);

        this.cProps = {
            x: coords.xCoord,
            y: coords.yCoord,
            rotationDeg: 0,
            scale: 0,
        }

        this.scaleUpStep = 0.05;
        this.scaleUpEnemyStep = 0.1;
        this.scaleDownStep = 0.03;
        this.rotationStep = 0.5;

        this.container;
        this.mainImage;

        this.create();
    }

    create() {
        this.container = document.createElement("div");
        this.container.className = "target";
        this.container.style.left = this.cProps.x + "px";
        this.container.style.top = this.cProps.y + "px";

        this.container.addEventListener("click", this.onTargetClick);

        this.mainImage = document.createElement("img");
        this.mainImage.className = "targetMainImage";
        this.mainImage.src = this.imagesUrl.imageURL;

        this.startScaleUpAnim();

        this.container.appendChild(this.mainImage);
    }

    startScaleUpAnim() {
        var duration = this.levelConfig.emergeTimeMsec / 1000 + "s";
        this.container.style.animation = "popUp " + duration + " forwards";
    }

    startFriendHidingAnimation() {
        var duration = this.levelConfig.backTimeMsec / 1000 + "s";
        this.container.style.animation = "popBack " + duration + " forwards";
    }

    startWrongHitAnimation() {
        var duration = WRONG_HIT_ANIM_TIME_MSEC / 1000 + "s";
        this.container.style.animation = "wrongHit " + duration + " forwards";
    }

    startRightHitAnimation() {
        var duration = RIGHT_HIT_ANIM_TIME_MSEC / 1000 + "s";
        this.container.style.animation = "rightHit " + duration + " forwards";
    }

    startTimeUpAnimation() {
        var duration = TIME_UP_ANIM_TIME_MSEC / 1000 + "s";
        this.container.style.animation = "enemyTimeUp " + duration + " forwards";
        this.container.style.zIndex = 100;
    }

    addToContainer(parentContainer) {
        parentContainer.appendChild(this.container);
    }

    removeFromContainer() {
        var parentContainer = this.container.parentElement;
        if (parentContainer) {
            parentContainer.removeChild(this.container);
        }
    }

    update(timeDeltaFactor) {
        var now = new Date();
        const emergeMilliseconds = now - this.emergeTimestamp;
        const waitMilliseconds = now - this.waitTimestamp;
        const waitOverMilliseconds = now - this.waitOverTimestamp;
        const hitMilliseconds = now - this.hitTimestamp;
        var trajectoryMilliseconds;
        if (this.trajectoryTimestamp) {
            trajectoryMilliseconds = now - this.trajectoryTimestamp;
        }

        switch (this.targetState) {
            case TARGET_STATES.TARGET_EMERGE:
                if (emergeMilliseconds >= this.levelConfig.emergeTimeMsec) {
                    this.changeState(TARGET_STATES.TARGET_ACTIVE);
                    this.waitTimestamp = new Date();
                }
                break;

            case TARGET_STATES.TARGET_ACTIVE:
                const waitTimeLimit = this.levelConfig.waitTimeMsec;
                if (waitMilliseconds >= waitTimeLimit) {
                    if (this.type === TARGET_TYPES.ENEMY) {
                        this.changeState(TARGET_STATES.ENEMY_TIME_UP);
                        this.startTimeUpAnimation();
                        //this.createNewMark({ x: this.cProps.x, y: this.cProps.y }, MARK_TYPES.TIME_UP);
                        this.onTargetTimeUp();
                    } else if (this.type === TARGET_TYPES.FRIEND) {
                        this.changeState(TARGET_STATES.FRIEND_HIDING);
                        this.startFriendHidingAnimation();
                    }

                    this.waitOverTimestamp = new Date();
                }
                break;

            case TARGET_STATES.ENEMY_TIME_UP:
                if (waitOverMilliseconds >= TIME_UP_ANIM_TIME_MSEC) {
                    this.changeState(TARGET_STATES.ENEMY_MISSED_GONE);
                }
                break;

            case TARGET_STATES.ENEMY_HIT:
                if (hitMilliseconds >= RIGHT_HIT_ANIM_TIME_MSEC) {
                    this.changeState(TARGET_STATES.ENEMY_KILLED_GONE);
                }
                break;

            case TARGET_STATES.FRIEND_HIT:
                if (hitMilliseconds >= WRONG_HIT_ANIM_TIME_MSEC) {
                    this.changeState(TARGET_STATES.FRIEND_KILLED_GONE);
                }
                break;

            case TARGET_STATES.FRIEND_HIDING:
                if (waitOverMilliseconds >= this.levelConfig.backTimeMsec) {
                    this.changeState(TARGET_STATES.FRIEND_SAVED_GONE);
                }
                break;
        }

        if (this.willMove && !this.inMove) {
            this.startNewMovement();
        } else if (trajectoryMilliseconds && trajectoryMilliseconds >= this.timeMSecToNextTrajectory) {
            this.startNewMovement();
        }

        if (this.inMove) {
            var steps = this.getSteps(timeDeltaFactor);

            var left = parseFloat(this.container.style.left) + steps.xStep + "px";
            var top = parseFloat(this.container.style.top) + steps.yStep + "px";

            this.container.style.left = left;
            this.container.style.top = top;
        }
    }

    onTargetClick(e) {
        if(this.getGameState() !== GAME_STATES.GAME_STARTED) {
            return;
        }

        this.hitTimestamp = new Date();
        var newState = "NO STATEEEE";
        if (this.targetState === TARGET_STATES.TARGET_ACTIVE) {
            if (this.type === TARGET_TYPES.ENEMY) {
                newState = TARGET_STATES.ENEMY_HIT;
                this.createNewMark(this.getCoords(), MARK_TYPES.RIGHT);
                this.startRightHitAnimation();
                this.onTargetHit(TARGET_TYPES.ENEMY);
            } else if (this.type === TARGET_TYPES.FRIEND) {
                newState = TARGET_STATES.FRIEND_HIT;
                this.createNewMark(this.getCoords(), MARK_TYPES.WRONG);
                this.startWrongHitAnimation();
                this.onTargetHit(TARGET_TYPES.FRIEND);
            }
            this.changeState(newState);
        }
    }

    changeState(newState) {
        this.targetState = newState;
    }

    getState() {
        return this.targetState;
    }

    getCoords() {
        var x = parseFloat(this.container.style.left);
        var y = parseFloat(this.container.style.top);

        return ({
            x: x,
            y: y,
        })
    }

    startNewMovement() {
        this.inMove = true;
        this.currentAngle = Math.random() * 360;
        const currentMaxStepFactor = (MAX_STEP_FACTOR*window.innerWidth + MAX_STEP_FACTOR*window.innerHeight)/2;
        const currentMinStepFactor = (MIN_STEP_FACTOR*window.innerWidth + MIN_STEP_FACTOR*window.innerHeight)/2;
        this.stepFactor = Math.random() * (currentMaxStepFactor - currentMinStepFactor) + currentMinStepFactor;

        this.xInvert = 1;
        this.yInvert = 1;

        this.trajectoryTimestamp = new Date();

        this.timeMSecToNextTrajectory = Math.random() * (MAX_TIME_NEXT_TRAJECTORY_MSEC - MIN_TIME_NEXT_TRAJECTORY_MSEC) + MIN_TIME_NEXT_TRAJECTORY_MSEC;
    }

    endMovement() {
        this.inMove = false;
    }

    getSteps(timeDeltaFactor) {
        var left = parseFloat(this.container.style.left);
        var top = parseFloat(this.container.style.top);

        if (left <= 0) {
            this.xInvert = -this.xInvert;
        } else if (left >= window.innerWidth * 0.9) {
            this.xInvert = -this.xInvert;
        }

        if (top <= window.innerHeight * 0.1) {
            this.yInvert = -this.yInvert;
        } else if (top >= window.innerHeight * 0.9) {
            this.yInvert = -this.yInvert;
        }

        var xStep = Math.cos(degreesToRadians(this.currentAngle)) * this.stepFactor * this.xInvert;
        var yStep = Math.sin(degreesToRadians(this.currentAngle)) * this.stepFactor * this.yInvert;

        xStep *= timeDeltaFactor;
        yStep *= timeDeltaFactor;

        this.currentAngle += this.targetStep;

        return ({
            xStep: xStep,
            yStep: yStep,
        })
    }
}



