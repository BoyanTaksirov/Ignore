const React = require("react");
const { Component } = require("react");
const BeginScreen = require("./BeginScreen");

const LANDSCAPE = require("../globals").LANDSCAPE;
const PORTRAIT = require("../globals").PORTRAIT;
const EN = require("../globals").EN;
const BG = require("../globals").BG;
const BEGIN_SCREEN = require("../globals").BEGIN_SCREEN;
const GAME_SCREEN = require("../globals").GAME_SCREEN;
const END_SCREEN = require("../globals").END_SCREEN;

module.exports = class MainView extends Component {
    constructor(props) {
        super(props);

        this.playSound = this.playSound.bind(this);
        this.getTranslation = this.getTranslation.bind(this);
        this.getInsults = this.getInsults.bind(this);

    }

    getTranslation(id) {
        return this.props.mainViewData.texts.LABELS[id];
    }

    getInsults() {
        return [...this.props.mainViewData.texts.INSULTS[this.props.mainViewData.wordsGender]];
    }

    playSound(soundName) {
        this.props.soundManager.play(soundName);
    }

    render() {
        let beginScreenInstance = null;

        switch (this.props.mainViewData.currentScreen) {
            case BEGIN_SCREEN:
                beginScreenInstance = <BeginScreen getTranslation= {this.getTranslation} getInsults= {this.getInsults} onStartButtonsClick= {this.props.onStartButtonsClick}/>;
                break;
        }

        return (
            <div style={{"height": "100%"}}>
                {beginScreenInstance}
            </div>
        )
    }
}