//const mainCss = require("../css/main.css");
//const preloaderCss = require("../css/preloader.css");
const { render } = require("react-dom");
const React = require("react");
const createRoot = require('react-dom/client').createRoot;

const PreloaderBlock = require("./loaders/preloader_block");
const Multiloader = require("./loaders/multiloader");
const SoundManager = require("./sound/SoundManager");
const RESOURCES_CONFIGURATION = require("./globals").RESOURCES_CONFIGURATION;
const LANDSCAPE = require("./globals").LANDSCAPE;
const PORTRAIT = require("./globals").PORTRAIT;
const BEGIN_SCREEN = require("./globals").BEGIN_SCREEN;
const GAME_SCREEN = require("./globals").GAME_SCREEN;
const MainView = require("./screens/MainView");
const GameScreen = require("./screens/GameScreen");
const { GAME_MODES } = require("./globals");

//------------------GLOBAL-----------------------
const TEXTS = {
    COMPLIMENTS: {},
    INSULTS: {},
};

//------------------resources------------------
var IMAGE_RESOURCES = { ENEMIES: [], FRIENDS: [], UTILS: {} };
var SOUND_RESOURCES = [];

//------------------preloader-----------------
var preloader;
//--------------------------------------------

//-------------------------sounds---------------------
var soundManager;

//------------------------logic---------------------
var gameScreen;

//-----------------------appModel-------------------
var appModel = {
    screenMode: LANDSCAPE,
    currentScreen: BEGIN_SCREEN,
    wordsGender: GAME_MODES.MALE
}

//----------------------------------------------

window.onload = () => loadResources();

function loadResources() {
    window.onload = null;

    var initialSize = { width: window.innerWidth, height: window.innerHeight };
    preloader = new PreloaderBlock(document.body, initialSize);
    preloader.setZIndex(101);
    preloader.addToContainer();

    var multiloader = new Multiloader();
    multiloader.setCallbacks(onResourcesLoaded, onResourcesLoadingProgress);
    multiloader.setData(RESOURCES_CONFIGURATION);
    multiloader.startLoading();
}

function onResourcesLoadingProgress(progress) {
    preloader.updatePreloader(progress);
}

function onResourcesLoaded(resourcesArray) {
    var insultsMale;
    var insultsFemale;
    var complimentsMale;
    var complimentsFemale;
    var blobTranslations;
    for (var i = 0; i < resourcesArray.length; i++) {
        if (resourcesArray[i].name === "insults_male") {
            insultsMale = resourcesArray[i].objectBlob;
        }
        else if (resourcesArray[i].name === "insults_female") {
            insultsFemale = resourcesArray[i].objectBlob;
        }
        if (resourcesArray[i].name === "compliments_male") {
            complimentsMale = resourcesArray[i].objectBlob;
        }
        else if (resourcesArray[i].name === "compliments_female") {
            complimentsFemale = resourcesArray[i].objectBlob;
        }
        else if (resourcesArray[i].name === "translations") {
            blobTranslations = resourcesArray[i].objectBlob;
        }
        else if (resourcesArray[i].name.includes("IMG_ENEMY")) {
            IMAGE_RESOURCES.ENEMIES.push(resourcesArray[i].objectURL);
        }
        else if (resourcesArray[i].name.includes("IMG_FRIEND")) {
            IMAGE_RESOURCES.FRIENDS.push(resourcesArray[i].objectURL);
        }
        else if (resourcesArray[i].name.includes("IMG_UTILS") || resourcesArray[i].name.includes("IMG_MBOX") ||
            resourcesArray[i].name.includes("IMG_INFO") || resourcesArray[i].name.includes("STRECH")) {
            IMAGE_RESOURCES.UTILS[resourcesArray[i].name] = resourcesArray[i].objectURL;
        }
        else if (resourcesArray[i].name.includes("SOUND")) {
            SOUND_RESOURCES.push({ name: resourcesArray[i].name, url: resourcesArray[i].objectURL });
        }
    }

    if (insultsMale) {
        var fileReaderPhrases = new FileReader();
        fileReaderPhrases.addEventListener("load", onSiteTextsParsedBg);
        fileReaderPhrases.readAsText(insultsMale);
    }
    if (insultsFemale) {
        var fileReaderPhrases = new FileReader();
        fileReaderPhrases.addEventListener("load", onSiteTextsParsedEn);
        fileReaderPhrases.readAsText(insultsFemale);
    }
    if (complimentsMale) {
        var fileReaderPhrases = new FileReader();
        fileReaderPhrases.addEventListener("load", onComplimentsParsedBg);
        fileReaderPhrases.readAsText(complimentsMale);
    }
    if (complimentsFemale) {
        var fileReaderPhrases = new FileReader();
        fileReaderPhrases.addEventListener("load", onComplimentsParsedEn);
        fileReaderPhrases.readAsText(complimentsFemale);
    }
    if (blobTranslations) {
        var fileReaderTranslations = new FileReader();
        fileReaderTranslations.addEventListener("load", onSiteTranslationsParsed);
        fileReaderTranslations.readAsText(blobTranslations);
    }
    if (!insultsMale && !insultsFemale) {
        throw new Error("NO INSULTS FOUND");
    }
}

function onSiteTextsParsedBg(e) {
    var result = e.target.result;
    onSiteTextsParsed(result, "insults_male");
}

function onSiteTextsParsedEn(e) {
    var result = e.target.result;
    onSiteTextsParsed(result, "insults_female");
}

function onComplimentsParsedBg(e) {
    var result = e.target.result;
    onSiteTextsParsed(result, "compliments_male");
}

function onComplimentsParsedEn(e) {
    var result = e.target.result;
    onSiteTextsParsed(result, "compliments_female");
}

function onSiteTranslationsParsed(e) {
    var result = e.target.result;
    onSiteTextsParsed(result, "translations");
}

function parseInsults(result) {
    var textsArray = result.split(",");
    var cleanStrings = [];
    for (var n = 0; n < textsArray.length; n++) {
        let str = clearString(textsArray[n]);
        if (str) {
            cleanStrings.push(str);
        }
    }

    return cleanStrings;
}

function parseLabels(result) {
    var textsArray1 = result.split("~");
    var textsObj = {};
    var cleanStrings = [];
    for (var n = 0; n < textsArray1.length; n++) {
        let str = clearString(textsArray1[n]);
        if (str) {
            cleanStrings.push(str);
        }
    }

    for (var i = 0; i < cleanStrings.length; i++) {
        var allStr = cleanStrings[i];
        var parsedStr = allStr.split("^");     

        textsObj[parsedStr[0]] = parsedStr[1];
    }

    return textsObj;
}

function clearString(str) {
    let newStr = str.trim();

    if (newStr === "") {
        return null;
    }

    return newStr;
}

function onSiteTextsParsed(result, mode) {
    if (mode === "insults_male") {
        TEXTS.INSULTS.MALE = parseInsults(result);
    } else if (mode === "insults_female") {
        TEXTS.INSULTS.FEMALE = parseInsults(result);
    } else if (mode === "compliments_male") {
        TEXTS.COMPLIMENTS.MALE = parseInsults(result);
    } else if (mode === "compliments_female") {
        TEXTS.COMPLIMENTS.FEMALE = parseInsults(result);
    } else if (mode === "translations") {
        TEXTS.LABELS = parseLabels(result);
    }

    if (TEXTS.COMPLIMENTS.MALE && TEXTS.COMPLIMENTS.FEMALE && TEXTS.INSULTS.MALE && TEXTS.INSULTS.FEMALE && TEXTS.LABELS) {
        startApp();
    }
}

function addEventListeners() {
    window.addEventListener("resize", onResize);
}

function onResize(e) {
    if (window.innerWidth >= window.innerHeight) {
        appModel.screenMode = LANDSCAPE;
    } else {
        appModel.screenMode = PORTRAIT;
    }
}

function onStartButtonsClick(gameModeData) {
    appModel.wordsGender = gameModeData.genderMode;
    turnGameScreenOn(gameModeData.wordsMode);
}

function startApp() {
    addEventListeners();
    setTimeout(preloader.removePreloader, 500);
    turnBeginScreenOn();
}

function getMainViewData() {
    return {
        currentScreen: appModel.currentScreen,
        texts: TEXTS,
        wordsGender: appModel.wordsGender,
    }
}

function turnBeginScreenOn() {
    appModel.currentScreen = BEGIN_SCREEN;

    emptyContainer();
    gameScreen = null;
    soundManager = null;
    var mainViewData = getMainViewData();

    const domNode = document.getElementById("GLOBAL_CONTAINER");
    const root = createRoot(domNode);
    root.render(<MainView mainViewData = {mainViewData} onStartButtonsClick = {onStartButtonsClick} />);
}

function emptyContainer() {
    var globalContainer = document.getElementById("GLOBAL_CONTAINER");
    while (globalContainer.firstChild) {
        globalContainer.removeChild(globalContainer.firstChild);
    }
}

function turnGameScreenOn(gameMode) {
    appModel.currentScreen = GAME_SCREEN;

    emptyContainer();

    var globalContainer = document.getElementById("GLOBAL_CONTAINER");
    soundManager = new SoundManager(SOUND_RESOURCES);
    soundManager.setVolume("SOUND_sad1", 1);
    gameScreen = new GameScreen(IMAGE_RESOURCES, TEXTS, globalContainer, soundManager, turnBeginScreenOn, appModel.wordsGender);

    gameScreen.startGame(gameMode);
}


//------------------------------------------------------------



