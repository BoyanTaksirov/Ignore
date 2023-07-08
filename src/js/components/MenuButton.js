const React = require("react");
const { Component } = require("react");

module.exports = class MenuButton extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        if(this.props.selectable) {
            if(this.props.selected) {
                return;
            }    
        }

        this.props.clickCallback();
    }

    render() {
        var buttonClassName = this.props.buttonClass || "menuButton";
        if(this.props.selectable && this.props.selected) {
            buttonClassName = this.props.buttonClass || "menuButtonSelected";
        }
        
        return (
            <div className = {buttonClassName} style= {this.props.style} onClick={this.onClick}>{this.props.text}</div>
        )
    }
}