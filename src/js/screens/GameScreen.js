const MARK_STATES = require("../globals").MARK_STATES;
const MARK_TYPES = require("../globals").MARK_TYPES;
const LEVEL_CONFIGURATION = require("../globals").LEVEL_CONFIGURATION;
const TARGET_STATES = require("../globals").TARGET_STATES;
const TARGET_TYPES = require("../globals").TARGET_TYPES;
const GAME_RULES = require("../globals").GAME_RULES;
const GAME_STATES = require("../globals").GAME_STATES;
const INITIAL_TARGET_TIME_MSEC = require("../globals").INITIAL_TARGET_TIME_MSEC;
const DEMOTIVATING = require("../globals").DEMOTIVATING;
const MOTIVATING = require("../globals").MOTIVATING;
const NEUTRAL = require("../globals").NEUTRAL;

const TIME_DELTA_TARGET_MSEC = require("../globals").TIME_DELTA_TARGET_MSEC;
const LAST_WORD_MIN_TIME_MSEC = require("../globals").LAST_WORD_MIN_TIME_MSEC;

const TARGET_MODES = require("../globals").TARGET_MODES;

const MAX_TIME_WAVE_WAIT_MSEC = require("../globals").MAX_TIME_WAVE_WAIT_MSEC;
const MIN_TIME_WAVE_WAIT_MSEC = require("../globals").MIN_TIME_WAVE_WAIT_MSEC;
const MAX_TIME_TARGETS_IN_WAVE_MSEC = require("../globals").MAX_TIME_TARGETS_IN_WAVE_MSEC;
const MIN_TIME_TARGETS_IN_WAVE_MSEC = require("../globals").MIN_TIME_TARGETS_IN_WAVE_MSEC;
const MAX_WAVE_TARGETS = require("../globals").MAX_WAVE_TARGETS;
const MIN_WAVE_TARGETS = require("../globals").MIN_WAVE_TARGETS;

const MAX_TIME_NEXT_WORD_MSEC = require("../globals").MAX_TIME_NEXT_WORD_MSEC;
const MIN_TIME_NEXT_WORD_MSEC = require("../globals").MIN_TIME_NEXT_WORD_MSEC;

const CE = require("../globals").CE;

const GameTarget = require("../logic/GameTarget");
const GameMark = require("../logic/GameMark");
const Timer = require("../utils/Timer");
const InfoBlock = require("../components/InfoBlock");
const GameOverMBox = require("../components/GameOverMBox");

module.exports = class GameScreen {
    constructor(imageURLs, texts, globalContainer, soundManager, turnBeginScreenOn, wordsGender) {
        this.imageURLs = imageURLs;
        this.texts = texts;
        this.soundManager = soundManager;
        this.turnBeginScreenOn = turnBeginScreenOn;
        this.wordsGender = wordsGender;

        this.createNewTarget = this.createNewTarget.bind(this);
        this.createNewMark = this.createNewMark.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.startGame = this.startGame.bind(this);
        this.onTargetHit = this.onTargetHit.bind(this);
        this.onTargetTimeUp = this.onTargetTimeUp.bind(this);
        this.onGameOverPressed = this.onGameOverPressed.bind(this);
        this.getTranslation = this.getTranslation.bind(this);
        this.createNewWord = this.createNewWord.bind(this);
        this.getGameState = this.getGameState.bind(this);

        this.lastFrameTimestamp;

        this.lastWordTimestamp;

        this.createTargetHandle;
        this.createWordHandle;

        this.targetMode = TARGET_MODES.NORMAL;

        this.allienAttackSoundNames = [
            "SOUND_alien_atack1",
            "SOUND_alien_atack2",
            "SOUND_alien_atack3",
            "SOUND_alien_atack4",
            "SOUND_alien_atack5",
            "SOUND_alien_atack6",
            "SOUND_alien_atack7"
        ];

        this.complimentColors = [
            "#63badf",
            "#84c1ab",
            "#e0cf9b",
            "#9bb9e0",
            "#e0ac9b",
            "#ff774d",
            "#ff774d",
            "#76ba00",
            "#5298c9",
            "#56d394",
            "#d38556",
            "#f18d79",
        ];

        this.insultColors = [
            "#000000",
            "#ff0000",
        ];

        this.gameModel = {
            gameType: null,
            enemiesKilled: 0,
            enemiesKilledCurrentLevel: 0,
            enemiesMissed: 0,
            friendsKilled: 0,
            friendsSaved: 0,
            targetsShown: 0,
            currentTargets: 0,
            currentLevel: 0,
            gameState: GAME_STATES.GAME_BEFORE_START,
            currentWaveTargets: 0,
            maxWaveTargets: 0,
            mistakes: 0,
        }

        const callbacks = [{
            func: this.gameLoop,
            timeIntervalMsec: 0.04,
        }];

        this.targets = [];
        this.marks = [];
        this.gameTimer = new Timer(10, callbacks);

        this.container;
        this.targetsContainer;
        this.textsContainer;
        this.create(globalContainer);
    }

    create(globalContainer) {
        this.container = document.createElement("div");
        this.container.className = "gameScreenContainer";
        globalContainer.appendChild(this.container);

        this.textsContainer = document.createElement("div");
        this.textsContainer.className = "textsContainer";
        this.container.appendChild(this.textsContainer);

        this.targetsContainer = document.createElement("div");
        this.targetsContainer.className = "targetsContainer";
        this.container.appendChild(this.targetsContainer);
    }

    addToContainer(parentContainer) {
        parentContainer.appendChild(this.container);
    }

    emptyContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    removeFromContainer() {
        var parentContainer = this.container.parentElement;
        if (parentContainer) {
            parentContainer.removeChild(this.container);
        }
    }

    startGame(gameType) {
        this.emptyContainer(this.targetsContainer);

        this.gameModel.gameType = gameType;
        this.gameModel.gameState = GAME_STATES.GAME_STARTED;

        const strechImageUrlPack = {
            upLeft: this.imageURLs.UTILS["STRECH_UP_LEFT"],
            upMiddle: this.imageURLs.UTILS["STRECH_UP_MIDDLE"],
            upRight: this.imageURLs.UTILS["STRECH_UP_RIGHT"],
            middleLeft: this.imageURLs.UTILS["STRECH_MIDDLE_LEFT"],
            middleMiddle: this.imageURLs.UTILS["STRECH_MIDDLE_MIDDLE"],
            middleRight: this.imageURLs.UTILS["STRECH_MIDDLE_RIGHT"],
            bottomLeft: this.imageURLs.UTILS["STRECH_BOTTOM_LEFT"],
            bottomMiddle: this.imageURLs.UTILS["STRECH_BOTTOM_MIDDLE"],
            bottomRight: this.imageURLs.UTILS["STRECH_BOTTOM_RIGHT"],
        }

        this.infoBlock = new InfoBlock(strechImageUrlPack);
        this.infoBlock.addToContainer(this.targetsContainer);
        this.updateInfoBlock();


        this.gameOverMbox = new GameOverMBox(this.onGameOverPressed, this.imageURLs.UTILS["IMG_MBOX"],
            this.imageURLs.UTILS["IMG_MBOX_OK1"], this.imageURLs.UTILS["IMG_MBOX_OK2"], this.getTranslation);

        clearTimeout(this.createTargetHandle);
        clearTimeout(this.createWordHandle);

        if (this.gameModel.gameType !== NEUTRAL) {
            this.createNewWord();
        }

        this.createTargetHandle = setTimeout(this.createNewTarget, INITIAL_TARGET_TIME_MSEC);
        this.gameTimer.start();
    }

    endGame() {
        this.gameTimer.reset();
        this.gameModel.gameState = GAME_STATES.GAME_OVER;

        clearTimeout(this.createTargetHandle);
        clearTimeout(this.createWordHandle);

        this.gameOverMbox.addToContainer(this.targetsContainer);
    }

    onGameOverPressed() {
        this.turnBeginScreenOn();
    }

    getGameTypeVisualData() {
        switch (this.gameModel.gameType) {
            case MOTIVATING:
                return ({
                    label: this.getTranslation("GAME_TYPE"),
                    value: this.getTranslation("MOTIVATING"),
                    className: "gameTypeRow",
                    style: {
                        color: "white",
                        backgroundColor: "green",
                    }
                });

            case DEMOTIVATING:
                return ({
                    label: this.getTranslation("GAME_TYPE"),
                    value: this.getTranslation("DEMOTIVATING"),
                    className: "gameTypeRow",
                    style: {
                        color: "black",
                        backgroundColor: "red",
                    }
                });

            case NEUTRAL:
                return ({
                    label: this.getTranslation("GAME_TYPE"),
                    value: this.getTranslation("NEUTRAL"),
                    className: "gameTypeRow",
                    style: {
                        color: "black",
                        backgroundColor: "white",
                    }
                });
        }
    }

    updateInfoBlock() {
        var gameTypeData = this.getGameTypeVisualData();
        const infoArr = [
            {
                label: this.getTranslation("ENEMIES_KILLED"),
                value: this.gameModel.enemiesKilled,
                className: "infoRow",
                style: {
                    color: "#00db05",
                }
            },
            {
                label: this.getTranslation("ENEMIES_MISSED"),
                value: this.gameModel.enemiesMissed,
                className: "infoRow",
                style: {
                    color: "#ff0000",
                }
            },
            {
                label: this.getTranslation("FRIENDS_KILLED"),
                value: this.gameModel.friendsKilled,
                className: "infoRow",
                style: {
                    color: "#ff0000",
                }
            },
            {
                label: this.getTranslation("FRIENDS_SAVED"),
                value: this.gameModel.friendsSaved,
                className: "infoRow",
                style: {
                    color: "#00db05",
                }
            },
            {
                label: this.getTranslation("MISTAKES"),
                value: this.gameModel.mistakes,
                className: "gameTypeRow",
                style: {
                    color: "#000000",
                    backgroundColor: "#ff0000",
                }
            },
            gameTypeData,
            {
                label: this.getTranslation("LEVEL"),
                value: LEVEL_CONFIGURATION[this.gameModel.currentLevel].level,
                className: "infoRow",
                style: {
                    color: "#ffffff",
                }
            },        
        ];

        this.infoBlock.updateDisplayInfo(infoArr);
    }

    getGameState() {
        return this.gameModel.gameState;
    }

    createNewTarget() {
        const chance = Math.random();
        const targetType = (chance < LEVEL_CONFIGURATION[this.gameModel.currentLevel].chanceEnemy) ? TARGET_TYPES.ENEMY : TARGET_TYPES.FRIEND;  //DEBUG

        const allMainImageURLs = (targetType === TARGET_TYPES.ENEMY) ? this.imageURLs.ENEMIES : this.imageURLs.FRIENDS;
        const imageIndex = Math.floor(Math.random() * allMainImageURLs.length);
        const mainImageURL = allMainImageURLs[imageIndex];

        const targetImageURLs = {
            imageURL: mainImageURL,
        }

        const targetLevelConfig = {
            waitTimeMsec: LEVEL_CONFIGURATION[this.gameModel.currentLevel].waitTimeMsec,
            emergeTimeMsec: LEVEL_CONFIGURATION[this.gameModel.currentLevel].emergeTimeMsec,
            backTimeMsec: LEVEL_CONFIGURATION[this.gameModel.currentLevel].backTimeMsec,
        }

        const xCoord = Math.round(Math.random() * (window.innerWidth * 0.7) + (window.innerWidth * 0.15));
        const yCoord = Math.round(Math.random() * (window.innerHeight * 0.5) + (window.innerHeight * 0.25));
        const coords = { xCoord, yCoord };

        const target = new GameTarget(targetType, targetImageURLs, targetLevelConfig, coords, this.createNewMark, this.onTargetHit, this.onTargetTimeUp,
            LEVEL_CONFIGURATION[this.gameModel.currentLevel].willMove, LEVEL_CONFIGURATION[this.gameModel.currentLevel].targetAngleStepDeg,
            this.getGameState, this.gameModel.targetsShown);

        target.addToContainer(this.targetsContainer);
        this.targets.push(target);

        this.gameModel.targetsShown++;
        this.gameModel.currentTargets = this.targets.length;

        this.soundManager.play("SOUND_pop_up");

        this.createNewWord();

        var targetMode = this.targetMode;

        switch (targetMode) {
            case TARGET_MODES.NORMAL:
                var isNewWave = (Math.random() < LEVEL_CONFIGURATION[this.gameModel.currentLevel].waveChance);
                if (isNewWave) {
                    this.startNewWave();
                }
                break;

            case TARGET_MODES.WAVE1.PHASE1:
                this.gameModel.currentWaveTargets++;
                this.targetMode = TARGET_MODES.WAVE1.PHASE2;
                break;

            case TARGET_MODES.WAVE1.PHASE2:
                if (this.gameModel.currentWaveTargets < this.gameModel.maxWaveTargets) {
                    this.gameModel.currentWaveTargets++;
                } else {
                    this.endWave();
                }
                break;
        }

        var timeToNextTargetMsec = this.getTimeToNextTarget();

        this.createTargetHandle = setTimeout(this.createNewTarget, timeToNextTargetMsec);
    }

    getTimeToNextTarget() {
        var timeToNextTargetMsec;

        switch (this.targetMode) {
            case TARGET_MODES.NORMAL:
                timeToNextTargetMsec = Math.random() * (LEVEL_CONFIGURATION[this.gameModel.currentLevel].nextTargetMaxTimeMsec -
                    LEVEL_CONFIGURATION[this.gameModel.currentLevel].nextTargetMinTimeMsec) +
                    LEVEL_CONFIGURATION[this.gameModel.currentLevel].nextTargetMinTimeMsec;
                break;

            case TARGET_MODES.WAVE1.PHASE1:
                timeToNextTargetMsec = Math.random() * (MAX_TIME_WAVE_WAIT_MSEC - MIN_TIME_WAVE_WAIT_MSEC) + MIN_TIME_WAVE_WAIT_MSEC;
                break;

            case TARGET_MODES.WAVE1.PHASE2:
                timeToNextTargetMsec = Math.random() * (MAX_TIME_TARGETS_IN_WAVE_MSEC - MIN_TIME_TARGETS_IN_WAVE_MSEC) + MIN_TIME_TARGETS_IN_WAVE_MSEC;
                break;
        }

        return timeToNextTargetMsec;
    }

    startNewWave() {
        this.targetMode = TARGET_MODES.WAVE1.PHASE1;
        this.gameModel.maxWaveTargets = Math.ceil(Math.random() * (MAX_WAVE_TARGETS - MIN_WAVE_TARGETS)) + MIN_WAVE_TARGETS;
        this.gameModel.currentWaveTargets = 0;
    }

    endWave() {
        this.targetMode = TARGET_MODES.NORMAL;
        this.gameModel.maxWaveTargets = 0;
        this.gameModel.currentWaveTargets = 0;
    }

    createNewMark(coords, type) {
        var markURL;

        switch (type) {
            case MARK_TYPES.RIGHT:
                markURL = this.imageURLs.UTILS["IMG_UTILS_CHECK"];
                break;

            case MARK_TYPES.WRONG:
                markURL = this.imageURLs.UTILS["IMG_UTILS_X"];
                break;

            case MARK_TYPES.TIME_UP:
                markURL = this.imageURLs.UTILS["IMG_UTILS_EXCL"];
                break;
        }

        const newMark = new GameMark(type, markURL, coords, this.gameModel.targetsShown);
        newMark.addToContainer(this.targetsContainer);
        this.marks.push(newMark);
    }

    createNewWord() {
        if (this.gameModel.gameType === NEUTRAL) {
            return;
        }

        const now = new Date();
        var lastWordTimePased;
        if (this.lastWordTimestamp) {
            lastWordTimePased = now - this.lastWordTimestamp;
            if (lastWordTimePased < LAST_WORD_MIN_TIME_MSEC) {
                return;
            }
        }

        clearTimeout(this.createWordHandle);

        this.emptyContainer(this.textsContainer);
        var word = CE("div", "gameInsultBase", this.textsContainer, "TEST");

        var wordPool;
        var color;
        var cIndex;
        switch (this.gameModel.gameType) {
            case MOTIVATING:
                wordPool = this.texts.COMPLIMENTS;
                cIndex = Math.floor(Math.random() * this.complimentColors.length);
                color = this.complimentColors[cIndex];
                word.className = "gameInsultBase";
                break;

            case DEMOTIVATING:
                wordPool = this.texts.INSULTS;
                cIndex = Math.floor(Math.random() * this.insultColors.length);
                color = this.insultColors[cIndex];
                word.className = "gameInsults";
                break;
        }

        if (!wordPool) {
            return;
        }

        var index = Math.floor(Math.random() * wordPool[this.wordsGender].length);

        const wordText = this.formatWord(wordPool[this.wordsGender][index]);

        var wordLengthFontSizeFactor = 7 / wordText.length;
        if (wordLengthFontSizeFactor > 3) {
            wordLengthFontSizeFactor = 3;
        } else if (wordLengthFontSizeFactor < 0.3) {
            wordLengthFontSizeFactor = 0.3;
        }

        var fontSize = (21 * wordLengthFontSizeFactor) + "vw";

        var left = window.innerWidth * 0.01;
        var top = Math.random() * window.innerHeight * 0.1 + window.innerHeight * 0.2;

        word.style.fontSize = fontSize;
        word.style.left = left + "px";
        word.style.top = top + "px";
        word.style.color = color;

        word.textContent = wordText;

        var rotation = (Math.random() * 20) - 10;
        word.style.transform = `rotate(${rotation}deg)`;

        this.lastWordTimestamp = new Date();

        const timeToNextWordMsec = Math.random() * (MAX_TIME_NEXT_WORD_MSEC - MIN_TIME_NEXT_WORD_MSEC) + MIN_TIME_NEXT_WORD_MSEC;

        this.createWordHandle = setTimeout(this.createNewWord, timeToNextWordMsec);
    }

    formatWord(word) {
        if (!word.includes("!")) {
            word += "!";
        }
        word = word.charAt(0).toUpperCase() + word.substring(1);

        return word;
    }

    checkForNewLevel() {
        if (this.gameModel.enemiesKilledCurrentLevel >= LEVEL_CONFIGURATION[this.gameModel.currentLevel].enemiesKilledNextLevel) {
            this.gameModel.currentLevel += 1;
            this.gameModel.enemiesKilledCurrentLevel = 0;
            if (this.gameModel.currentLevel >= LEVEL_CONFIGURATION.length) {
                this.gameModel.currentLevel = LEVEL_CONFIGURATION.length - 1;
            }
        }
    }

    onTargetHit(type) {
        if (this.gameModel.gameState !== GAME_STATES.GAME_STARTED) {
            return;
        }

        switch (type) {
            case TARGET_TYPES.ENEMY:
                this.soundManager.play("SOUND_alien1");
                break;

            case TARGET_TYPES.FRIEND:
                this.soundManager.play("SOUND_sad1");
                break;
        }
    }

    onTargetTimeUp() {
        const index = Math.floor(Math.random() * this.allienAttackSoundNames.length);
        this.soundManager.play(this.allienAttackSoundNames[index]);
    }

    gameLoop() {     // here we update targets and clean them from the screen if needed
        if (this.gameModel.gameState !== GAME_STATES.GAME_STARTED) {
            return;
        }

        const now = new Date();
        var lastFrameMsec;
        var timeDeltaFactor = 10;
        if (this.lastFrameTimestamp) {
            lastFrameMsec = now - this.lastFrameTimestamp;

            timeDeltaFactor = lastFrameMsec / TIME_DELTA_TARGET_MSEC;
        }

        this.lastFrameTimestamp = new Date();

        for (let i = 0; i < this.targets.length; i++) {
            this.targets[i].update(timeDeltaFactor);
            const targetState = this.targets[i].getState();
            switchBlock:
            switch (targetState) {
                case TARGET_STATES.TARGET_ACTIVE:
                    break switchBlock;

                case TARGET_STATES.ENEMY_TIME_UP:
                    break switchBlock;

                case TARGET_STATES.ENEMY_HIT:
                    break switchBlock;

                case TARGET_STATES.FRIEND_HIT:
                    break switchBlock;

                case TARGET_STATES.FRIEND_HIDING:
                    break switchBlock;

                case TARGET_STATES.ENEMY_KILLED_GONE:
                    this.gameModel.enemiesKilled++;
                    this.gameModel.enemiesKilledCurrentLevel++;
                    this.targets[i].removeFromContainer();
                    this.targets.splice(i, 1);
                    this.checkForNewLevel();
                    this.updateInfoBlock();
                    i--;
                    break switchBlock;

                case TARGET_STATES.ENEMY_MISSED_GONE:
                    this.gameModel.enemiesMissed++;
                    this.gameModel.mistakes++;
                    this.targets[i].removeFromContainer();
                    this.targets.splice(i, 1);
                    i--;
                    this.updateInfoBlock();
                    this.checkForEndGame();
                    break switchBlock;

                case TARGET_STATES.FRIEND_SAVED_GONE:
                    this.gameModel.friendsSaved++;
                    this.targets[i].removeFromContainer();
                    this.targets.splice(i, 1);
                    i--;
                    this.updateInfoBlock();
                    break switchBlock;

                case TARGET_STATES.FRIEND_KILLED_GONE:
                    this.gameModel.friendsKilled++;
                    this.gameModel.mistakes++;
                    this.targets[i].removeFromContainer();
                    this.targets.splice(i, 1);
                    i--;
                    this.updateInfoBlock();
                    this.checkForEndGame();
                    break switchBlock;
            }
        }

        for (let m = 0; m < this.marks.length; m++) {
            this.marks[m].update();
            const markState = this.marks[m].getState();

            marksLoop:
            switch (markState) {
                case MARK_STATES.MARK_ACTIVE:
                    break marksLoop;

                case MARK_STATES.MARK_HIDING:
                    break marksLoop;

                case MARK_STATES.MARK_GONE:
                    this.marks[m].removeFromContainer();
                    this.marks.splice(m, 1);
                    m--;
                    break marksLoop;
            }
        }
    }

    checkForEndGame() {
        if (this.gameModel.mistakes >= GAME_RULES.maxMistakes) {
            this.endGame();
            this.soundManager.play("SOUND_game_over");
        }
    }

    getTranslation(id) {
        return this.texts.LABELS[id];
    }
}