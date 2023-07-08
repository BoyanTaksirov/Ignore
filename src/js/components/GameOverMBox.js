module.exports = class GameOverMBox {
    constructor(okPressedCallback, mboxImgUrl, ok1ImgUrl, ok2ImgUrl, getTranslation) {
        this.displayData;
        this.container;
        this.mboxImgUrl = mboxImgUrl;
        this.ok1ImgUrl = ok1ImgUrl;
        this.ok2ImgUrl = ok2ImgUrl;
        this.getTranslation = getTranslation;

        this.ok1Btn;
        this.ok2Btn;

        this.okPressedCallback = okPressedCallback;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseUpOutside = this.onMouseUpOutside.bind(this);

        this.create();
    }

    create() {
        this.containerBkg = document.createElement("div");
        this.containerBkg.style.width = "100%";
        this.containerBkg.style.height = "100%";

        this.containerBkg.addEventListener("mouseup", this.onMouseUpOutside);

        this.container = document.createElement("div");
        this.container.className = "mbox";

        this.containerBkg.appendChild(this.container);

        var mboxImg = document.createElement("img");
        mboxImg.src = this.mboxImgUrl;
        mboxImg.className = "mboxImage";
        this.container.appendChild(mboxImg);

        this.ok1Btn = document.createElement("img");
        this.ok1Btn.src = this.ok1ImgUrl;
        this.ok1Btn.className = "mboxOk1Button";
        this.ok1Btn.style.zIndex = 2;
        this.ok1Btn.addEventListener("mousedown", this.onMouseDown);
        this.ok1Btn.addEventListener("mouseup", this.onMouseUp);
        this.container.appendChild(this.ok1Btn);

        this.ok2Btn = document.createElement("img");
        this.ok2Btn.src = this.ok2ImgUrl;
        this.ok2Btn.className = "mboxOk2Button";
        this.ok2Btn.style.display = "none";
        this.ok2Btn.style.zIndex = 1;
        this.container.appendChild(this.ok2Btn);

        var label = document.createElement("div");
        label.textContent = this.getTranslation("GAME_OVER");
        label.className = "mboxLabelText";
        this.container.appendChild(label);
    }

    addToContainer(parentContainer) {
        parentContainer.appendChild(this.containerBkg);
    }

    removeFromContainer() {
        var parentContainer = this.containerBkg.parentElement;
        if(parentContainer) {
            parentContainer.removeChild(this.containerBkg);
        }
    }

    emptyContainer() {
        while (this.containerBkg.firstChild) {
            this.containerBkg.removeChild(this.containerBkg.firstChild);
        }
    }

    onMouseDown(e) {
        this.ok1Btn.style.opacity = 0;
        this.ok2Btn.style.display = "block";
    }

    onMouseUp(e) {
        if(e) {
            e.stopImmediatePropagation();
        }
        this.ok1Btn.style.opacity = 1;
        this.okPressedCallback();
    }

    onMouseUpOutside(e) {
        e.stopImmediatePropagation();
        this.onMouseUp();
    }
}