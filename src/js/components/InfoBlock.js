const CE = require("../globals").CE;
const StrechImage = require("./StrechImage");

module.exports = class InfoBlock {
    constructor(bkgImageUrlPack) {
        this.displayData;
        this.container;
        this.dataHolder;
        this.bkgImg;

        this.onResize = this.onResize.bind(this);

        this.create(bkgImageUrlPack);

        window.addEventListener("resize", this.onResize);

        this.onResize(bkgImageUrlPack);
    }

    create(bkgImageUrlPack) {
        this.container = CE("div", "infoBlock", null, "INFO_CONTAINER");
        this.bkgImg = new StrechImage(bkgImageUrlPack);
        this.bkgImg.addToContainer(this.container);
        this.dataHolder = CE("div", "infoDataHolder", this.container, "DATA_HOLDER");
    }

    onResize(e) {
        var height = this.dataHolder.clientHeight;
        this.container.style.height = height * 1.1 + "px";
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
        while (this.dataHolder.firstChild) {
            this.dataHolder.removeChild(this.dataHolder.firstChild);
        }
    }

    updateDisplayInfo(dataArr) {
        this.displayData = dataArr;

        this.emptyContainer();

        var counter = 1;
        var currentSector = CE("div", null, this.dataHolder, "SECTOR_" + counter);
        for (var i = 0; i < this.displayData.length; i++) {
            if (i !== 0 && i % 2 === 0) {
                counter++;
                currentSector = CE("div", null, this.dataHolder, "SECTOR_" + counter);
            }
            var row = document.createElement("div");
            row.className = this.displayData[i].className;
            row.innerHTML = `${this.displayData[i].label}:&nbsp;${this.displayData[i].value}&nbsp;&nbsp;&nbsp;`;
            for (var styleProp in this.displayData[i].style) {
                row.style[styleProp] = this.displayData[i].style[styleProp];
            }

            currentSector.appendChild(row);
        }

        this.onResize();
    }
}