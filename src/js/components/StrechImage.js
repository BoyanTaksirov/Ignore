const CE = require("../globals").CE;

module.exports = class StrechImage {
    constructor(imageUrlsPack, cornerDimensions) {

        this.imageUrlsPack = imageUrlsPack;
        this.cornerDimensions = cornerDimensions;

        this.container;
        this.upperHolder;
        this.middleHolder;
        this.bottomHolder;

        this.upLeft;
        this.upMiddle;
        this.upRight;
        this.middleLeft;
        this.middleMiddle;
        this.middleRight;
        this.bottomLeft;
        this.bottomMiddle;
        this.bottomRight;

        this.create();
    }

    create() {
        this.container = CE("div", "strechContainer", null, "STRECH_CONTAINER");
        this.upperHolder = CE("div", "strechUpperBottomHolder", this.container, "STRECH_UPPER_HOLDER");
        this.middleHolder = CE("div", "strechMiddleHolder", this.container, "STRECH_MIDDLE_HOLDER");
        this.bottomHolder = CE("div", "strechUpperBottomHolder", this.container, "STRECH_BOTTOM_HOLDER");
        this.bottomHolder.classList.add("bottomInfoBorderHeightFix");

        this.upLeft = CE("img", "strechCorner", this.upperHolder, "STRECH_UP_LEFT");
        this.upLeft.src = this.imageUrlsPack.upLeft;
        this.upRight = CE("img", "strechCorner", this.upperHolder, "STRECH_UP_RIGHT");
        this.upRight.src = this.imageUrlsPack.upRight;
        this.middleLeft = CE("div", "strech_VMiddle", this.middleHolder, "STRECH_MIDDLE_LEFT");
        this.middleRight = CE("div", "strech_VMiddle", this.middleHolder, "STRECH_MIDDLE_RIGHT");
        this.middleRight.style.backgroundPositionX = "right";
        this.bottomLeft = CE("img", "strechCorner", this.bottomHolder, "STRECH_BOTTOM_LEFT");
        this.bottomLeft.src = this.imageUrlsPack.bottomLeft;
        this.bottomRight = CE("img", "strechCorner", this.bottomHolder, "STRECH_BOTTOM_RIGHT");
        this.bottomRight.src = this.imageUrlsPack.bottomRight;
       
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

    emptyContainer() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }
}