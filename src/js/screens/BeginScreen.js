const React = require("react");
const { Component } = require("react");

const MAX_INSULTS_BS = require("../globals").MAX_INSULTS_BS;
const BS_WORDS_SIZE_RANGE = require("../globals").BS_WORDS_SIZE_RANGE;
const DEMOTIVATING = require("../globals").DEMOTIVATING;
const MOTIVATING = require("../globals").MOTIVATING;
const NEUTRAL = require("../globals").NEUTRAL;

const GAME_MODES = require("../globals").GAME_MODES;

const MenuButton = require("../components/MenuButton");

module.exports = class BeginScreen extends Component {
    constructor(props) {
        super(props);

        this.onGenderButtonsClick = this.onGenderButtonsClick.bind(this);
        this.onStartButtonsClick = this.onStartButtonsClick.bind(this);
        this.openManual = this.openManual.bind(this);
        this.closeManual = this.closeManual.bind(this);
        this.onResize = this.onResize.bind(this);

        this.insults = null;

        this.state = {
            genderMode: GAME_MODES.MALE,
            manualShown: false,
        }

        window.addEventListener("resize", this.onResize);
    }

    createInsults() {
        const insults = this.props.getInsults();
        const chosenInsults = [];
        const insultsElements = [];

        for (var n = 0; n < MAX_INSULTS_BS; n++) {
            const index = Math.floor(Math.random() * insults.length);
            chosenInsults.push(insults[index]);
            insults.splice(index, 1);
        }

        for (var i = 0; i < chosenInsults.length; i++) {
            const transformStr = "rotate(" + (Math.random() * 100 - 50) + "deg)";
            const fontSizeStr = Math.random() * (BS_WORDS_SIZE_RANGE[1] - BS_WORDS_SIZE_RANGE[0]) + BS_WORDS_SIZE_RANGE[0] + "rem";
            const topStr = (Math.random() * window.innerHeight * 1.2 - window.innerHeight * 0.2) + "px";
            const leftStr = (Math.random() * window.innerWidth * 1.2 - window.innerWidth * 0.2) + "px";

            const insultStyle = {
                "transform": transformStr,
                "fontSize": fontSizeStr,
                "top": topStr,
                "left": leftStr
            }

            const insultElementClass = "beginScrInsult" + Math.floor(Math.random() * 4);
            var insultElement = <div className={insultElementClass} style={insultStyle} id={"INSULT# " + i}>{chosenInsults[i] + "!"}</div>

            insultsElements.push(insultElement);
        }

        return insultsElements;
    }

    onGenderButtonsClick(gender) {
        this.setState({
            genderMode: gender,
        })
    }

    onStartButtonsClick(wordsMode) {
        const gameModeData = {
            genderMode: this.state.genderMode,
            wordsMode: wordsMode,
        }

        this.props.onStartButtonsClick(gameModeData);
    }

    openManual() {
        this.setState({ manualShown: true });
    }

    closeManual() {
        this.setState({ manualShown: false });
    }

    onResize() {
        this.insults = this.createInsults();
        this.forceUpdate();
    }

    render() {
        const motivatingBtn = <MenuButton text={this.props.getTranslation("MOTIVATING")} style={{ width: "80%" }} clickCallback={() => this.onStartButtonsClick(MOTIVATING)} />
        const demotivatingBtn = <MenuButton text={this.props.getTranslation("DEMOTIVATING")} style={{ width: "80%" }} clickCallback={() => this.onStartButtonsClick(DEMOTIVATING)}
            buttonClass="menuButtonDemotivate" />
        const neutralBtn = <MenuButton text={this.props.getTranslation("NEUTRAL")} style={{ width: "80%" }} clickCallback={() => this.onStartButtonsClick(NEUTRAL)} />
        const maleBtn = <MenuButton text={this.props.getTranslation("MALE")} style={{ width: "50%" }} selectable={true} selected={(this.state.genderMode === GAME_MODES.MALE)}
            clickCallback={() => this.onGenderButtonsClick(GAME_MODES.MALE)} />
        const femaleBtn = <MenuButton text={this.props.getTranslation("FEMALE")} style={{ width: "50%" }} selectable={true} selected={(this.state.genderMode === GAME_MODES.FEMALE)}
            clickCallback={() => this.onGenderButtonsClick(GAME_MODES.FEMALE)} />
        const manualBtn = <MenuButton text={this.props.getTranslation("MANUAL_BTN")} buttonClass={"menuButtonManual"} clickCallback={this.openManual} />


        var manualSection;

        if (this.state.manualShown) {
            var manualText = this.props.getTranslation("MANUAL_TEXT");
            var mTextArr = manualText.split("#");

            var manualTextElements = mTextArr.map(function (element) {
                if (element && element !== "") {
                    return <div>{element}</div>
                } else {
                    return <br></br>
                }
            })


            const manualCloseButton = <MenuButton text={this.props.getTranslation("CLOSE")}
                buttonClass="manualCloseButton"
                clickCallback={this.closeManual} />

            manualSection = <div className="manualSection">
                <div>
                    {manualTextElements}
                </div>
                {manualCloseButton}
            </div>
        }

        if (!this.insults) {
            this.insults = this.createInsults();
        }
        return (
            <div className="beginScreenContainer" id="BEGIN_SCREEN_CONTAINER">
                <div className="beginScrBkg" id="B_S_HEADER_CONTAINER">
                    <div className="insultsHolder">
                        {this.insults}
                    </div>
                    <div className="beginScreenElementsHolder">
                        <div className="headerText" id="B_S_HEADER_TITLE">{this.props.getTranslation("IGNORE_NAME")}</div>
                        <div className="menuButtonsContainer">
                            <div className="semiTransparentAndBorder">
                                <div className="bsItemsHolder">
                                    {this.props.getTranslation("MALE_OR_FEMALE")}
                                </div>
                                <div className="bsItemsHolder">
                                    {maleBtn} {femaleBtn}
                                </div>
                            </div>
                            <div className="gameModeButtonsHolder semiTransparentAndBorder">
                                <div className="bsItemsHolder">
                                    {this.props.getTranslation("GAME_MODE")}
                                </div>
                                {motivatingBtn}
                                {demotivatingBtn}
                                {neutralBtn}
                            </div>
                            {manualBtn}
                        </div>
                    </div>
                </div>
                {manualSection}
                <div className="disclaimerBS">
                    {this.props.getTranslation("DISCLAIMER1")}
                </div>
            </div>
        );
    }
}