const MARK_TYPES = require("../globals").MARK_TYPES;
const MARK_STATES = require("../globals").MARK_STATES;
const MARK_STAY_TIME_MSEC = require("../globals").MARK_STAY_TIME_MSEC;
const MARK_HIDE_TIME_MSEC = require("../globals").MARK_HIDE_TIME_MSEC;

module.exports = class GameMark {
    constructor(type, imageUrl, coords, id) {
        this.type = type;
        this.imageUrl = imageUrl;
        this.coords = coords;
        this.id = id;
        this.birthTime = new Date();
        this.markState = MARK_STATES.MARK_ACTIVE;

        this.create();

        this.startFadeInAnimation();
    }

    create() {
        this.container = document.createElement("div");
        this.container.className = "mark";
        this.container.style.left = this.coords.x + "px";
        this.container.style.top = this.coords.y + "px";

        this.container.addEventListener("click", this.onTargetClick);

        this.mainImage = document.createElement("img");
        this.mainImage.className = "markImage";
        this.mainImage.src = this.imageUrl;

        this.container.appendChild(this.mainImage);
    }

    addToContainer(parentContainer) {
        parentContainer.appendChild(this.container);
    }

    removeFromContainer() {
        var parentContainer = this.container.parentElement;
        if(parentContainer) {
            parentContainer.removeChild(this.container);
        }
    }

    update() {
        var now = new Date();
        const ageMilliseconds = now - this.birthTime;

        switch (this.markState) {
            case MARK_STATES.MARK_ACTIVE:
                if (ageMilliseconds >= MARK_STAY_TIME_MSEC) {
                    this.changeState(MARK_STATES.MARK_HIDING);
                    this.startFadeOutAnimation();
                }
                break;

            case MARK_STATES.MARK_HIDING:
                const hideTimeLimit = (MARK_STAY_TIME_MSEC + MARK_HIDE_TIME_MSEC);
                if (ageMilliseconds >= hideTimeLimit) {
                    this.changeState(MARK_STATES.MARK_GONE);
                }
                break;
        }
    }

    startFadeInAnimation() {
        this.container.style.left = this.coords.x + "px";
        this.container.style.top = this.coords.y + "px";

        const animationDuration = (MARK_HIDE_TIME_MSEC / 1000) + "s";

        this.container.style.animationName = "fadeIn";
        this.container.style.animationDuration = animationDuration;
        this.container.style.animationFillMode = "forwards";
    }

    startFadeOutAnimation() {
        this.container.style.left = this.coords.x + "px";
        this.container.style.top = this.coords.y + "px";

        const animationDurationHiding = (MARK_HIDE_TIME_MSEC / 1000) + "s";

        this.container.style.animationName = "fadeOut";
        this.container.style.animationDuration = animationDurationHiding;
        this.container.style.animationFillMode = "forwards";
    }

    getState() {
        return this.markState;
    }

    changeState(newState) {
        this.markState = newState;
    }

    createComponent() {
        const style = {
            left: this.coords.x + "px",
            top: this.coords.y + "px",
        }

        switch (this.markState) {
            case MARK_STATES.MARK_ACTIVE:
                const animationDuration = (MARK_HIDE_TIME_MSEC / 1000) + "s";
                style.animationName = "fadeIn";
                style.animationDuration = animationDuration;
                style.animationFillMode = "forwards";
                break;

            case MARK_STATES.MARK_HIDING:
                const animationDurationHiding = (MARK_HIDE_TIME_MSEC / 1000) + "s";
                style.animationName = "fadeOut";
                style.animationDuration = animationDurationHiding;
                style.animationFillMode = "forwards";
                break;
        }



        return (
            <div className="mark" style={style}>
                <img src={this.imageUrl} className="markImage" style={style}></img>
            </div>
        )
    }
}