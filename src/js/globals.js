//-------GLOBAL CONSTANTS -----------------------------
module.exports.LANDSCAPE = "LANDSCAPE";
module.exports.PORTRAIT = "PORTRAIT";
module.exports.EN = "en";
module.exports.BG = "bg";
module.exports.MAX_INSULTS_BS = 50;
module.exports.BS_WORDS_SIZE_RANGE = [3, 10];
module.exports.DEMOTIVATING = "DEMOTIVATING";
module.exports.MOTIVATING = "MOTIVATING";
module.exports.NEUTRAL = "NEUTRAL";
module.exports.BEGIN_SCREEN = "BEGIN_SCREEN";
module.exports.GAME_SCREEN = "GAME_SCREEN";
module.exports.END_SCREEN = "END_SCREEN";

//--------------------SYSTEM--------------------------------
module.exports.GAME_MODES = {
    MALE: "MALE",
    FEMALE: "FEMALE",
}

module.exports.GAME_STATES = {
    GAME_BEFORE_START: "GAME_BEFORE_START",
    GAME_STARTED: "GAME_STARTED",
    GAME_OVER: "GAME_OVER",
}

module.exports.TARGET_MODES = {
    NORMAL: "NORMAL",
    WAVE1: {
        PHASE1: "WAVE1.PHASE1",
        PHASE2: "WAVE1.PHASE2",
    }
}

module.exports.MARK_TYPES = {
    RIGHT: "RIGHT",
    WRONG: "WRONG",
    TIME_UP: "TIME_UP",
}

module.exports.MARK_STATES = {
    MARK_ACTIVE: "MARK_ACTIVE",
    MARK_HIDING: "MARK_HIDING",
    MARK_GONE: "MARK_GONE",
}

//---------------------------GAME CONSTANTS-------------------------
module.exports.TARGET_STATES = {
    TARGET_EMERGE: "TARGET_EMERGE",
    TARGET_ACTIVE: "TARGET_ACTIVE",

    ENEMY_TIME_UP: "ENEMY_TIME_UP",
    ENEMY_HIT: "ENEMY_HIT",
    ENEMY_MISSED_GONE: "ENEMY_MISSED_GONE",
    ENEMY_KILLED_GONE: "ENEMY_KILLED_GONE",

    FRIEND_HIDING: "FRIEND_HIDING",
    FRIEND_HIT: "FRIEND_HIT",
    FRIEND_SAVED_GONE: "FRIEND_SAVED_GONE",
    FRIEND_KILLED_GONE: "FRIEND_KILLED_GONE",
}

module.exports.TARGET_TYPES = {
    ENEMY: "ENEMY",
    FRIEND: "FRIEND"
}

module.exports.GAME_RULES = {
    maxFriendsKilled: 3,
    maxEnemiesMissed: 3,
    maxMistakes: 3,
}

module.exports.INITIAL_TARGET_TIME_MSEC = 2;

module.exports.MARK_STAY_TIME_MSEC = 1000;
module.exports.MARK_HIDE_TIME_MSEC = 300;

module.exports.TIME_UP_ANIM_TIME_MSEC = 1000;
module.exports.RIGHT_HIT_ANIM_TIME_MSEC = 500;
module.exports.WRONG_HIT_ANIM_TIME_MSEC = 300;

module.exports.LAST_WORD_MIN_TIME_MSEC = 2000;

module.exports.TARGET_ANGLE_STEP_DEG = 1;
module.exports.MAX_STEP_FACTOR = 0.004;
module.exports.MIN_STEP_FACTOR = 0.002;

module.exports.MAX_TIME_NEXT_TRAJECTORY_MSEC = 2000;
module.exports.MIN_TIME_NEXT_TRAJECTORY_MSEC = 500;

module.exports.MAX_TIME_WAVE_WAIT_MSEC = 10000;
module.exports.MIN_TIME_WAVE_WAIT_MSEC = 5000;
module.exports.MAX_TIME_TARGETS_IN_WAVE_MSEC = 600;
module.exports.MIN_TIME_TARGETS_IN_WAVE_MSEC = 300;
module.exports.MAX_WAVE_TARGETS = 6;
module.exports.MIN_WAVE_TARGETS = 2;

module.exports.MAX_TIME_NEXT_WORD_MSEC = 4000;
module.exports.MIN_TIME_NEXT_WORD_MSEC = 2200;

module.exports.TIME_DELTA_TARGET_MSEC = 10;


const emergeHideTime = 300;
const nextTargetMaxTimeMsecBase = 4000;
const nextTargetMinTimeMsecBase = 100;

module.exports.LEVEL_CONFIGURATION = [
    {
        level: 1,
        waitTimeMsec: 1500,
        emergeTimeMsec: emergeHideTime,
        backTimeMsec: emergeHideTime,
        chanceEnemy: 0.5,
        nextTargetMaxTimeMsec: nextTargetMaxTimeMsecBase * 1,
        nextTargetMinTimeMsec: nextTargetMinTimeMsecBase * 1,
        enemiesKilledNextLevel: 10,
        waveChance: 0.1,
    },
    {
        level: 2,
        waitTimeMsec: 7000,
        emergeTimeMsec: emergeHideTime,
        backTimeMsec: emergeHideTime,
        chanceEnemy: 0.5,
        nextTargetMaxTimeMsec: nextTargetMaxTimeMsecBase * 1.5,
        nextTargetMinTimeMsec: nextTargetMinTimeMsecBase * 1.5,
        enemiesKilledNextLevel: 12,
        waveChance: 0.1,
        willMove: true,
        targetAngleStepDeg: 3,
    },
    {
        level: 3,
        waitTimeMsec: 1000,
        emergeTimeMsec: emergeHideTime,
        backTimeMsec: emergeHideTime,
        chanceEnemy: 0.5,
        nextTargetMaxTimeMsec: nextTargetMaxTimeMsecBase * 0.8,
        nextTargetMinTimeMsec: nextTargetMinTimeMsecBase * 0.8,
        enemiesKilledNextLevel: 14,
        waveChance: 0.2,
    },
    {
        level: 4,
        waitTimeMsec: 6000,
        emergeTimeMsec: emergeHideTime,
        backTimeMsec: emergeHideTime,
        chanceEnemy: 0.5,
        nextTargetMaxTimeMsec: nextTargetMaxTimeMsecBase * 1.4,
        nextTargetMinTimeMsec: nextTargetMinTimeMsecBase * 1.4,
        enemiesKilledNextLevel: 16,
        waveChance: 0.2,
        willMove: true,
        targetAngleStepDeg: 2,
    },
    {
        level: 5,
        waitTimeMsec: 900,
        emergeTimeMsec: emergeHideTime,
        backTimeMsec: emergeHideTime,
        chanceEnemy: 0.5,
        nextTargetMaxTimeMsec: nextTargetMaxTimeMsecBase * 0.6,
        nextTargetMinTimeMsec: nextTargetMinTimeMsecBase * 0.6,
        enemiesKilledNextLevel: 18,
        waveChance: 0.3,
    },
    {
        level: 6,
        waitTimeMsec: 5000,
        emergeTimeMsec: emergeHideTime,
        backTimeMsec: emergeHideTime,
        chanceEnemy: 0.5,
        nextTargetMaxTimeMsec: nextTargetMaxTimeMsecBase * 1.2,
        nextTargetMinTimeMsec: nextTargetMinTimeMsecBase * 1.2,
        enemiesKilledNextLevel: 20,
        waveChance: 0.32,
        willMove: true,
        targetAngleStepDeg: 1.5,
    },
    {
        level: 7,
        waitTimeMsec: 800,
        emergeTimeMsec: emergeHideTime,
        backTimeMsec: emergeHideTime,
        chanceEnemy: 0.5,
        nextTargetMaxTimeMsec: nextTargetMaxTimeMsecBase * 0.5,
        nextTargetMinTimeMsec: nextTargetMinTimeMsecBase * 0.5,
        enemiesKilledNextLevel: 22,
        waveChance: 0.4,
    },
    {
        level: 8,
        waitTimeMsec: 4000,
        emergeTimeMsec: emergeHideTime,
        backTimeMsec: emergeHideTime,
        chanceEnemy: 0.5,
        nextTargetMaxTimeMsec: nextTargetMaxTimeMsecBase * 1,
        nextTargetMinTimeMsec: nextTargetMinTimeMsecBase * 1,
        enemiesKilledNextLevel: 24,
        waveChance: 0.4,
        willMove: true,
        targetAngleStepDeg: 1,
    },
    {
        level: 9,
        waitTimeMsec: 700,
        emergeTimeMsec: emergeHideTime,
        backTimeMsec: emergeHideTime,
        chanceEnemy: 0.5,
        nextTargetMaxTimeMsec: nextTargetMaxTimeMsecBase * 0.4,
        nextTargetMinTimeMsec: nextTargetMinTimeMsecBase * 0.4,
        enemiesKilledNextLevel: 26,
        waveChance: 0.5,
    },
    {
        level: 10,
        waitTimeMsec: 2500,
        emergeTimeMsec: emergeHideTime,
        backTimeMsec: emergeHideTime,
        chanceEnemy: 0.5,
        nextTargetMaxTimeMsec: nextTargetMaxTimeMsecBase * 0.5,
        nextTargetMinTimeMsec: nextTargetMinTimeMsecBase * 0.5,
        enemiesKilledNextLevel: 28,
        waveChance: 0.5,
        willMove: true,
        targetAngleStepDeg: 0.5,
    },
]


module.exports.SCORE_TABLE = {
    ENEMY_KILLED: 1,
    ENEMY_MISSED: -2,
    FRIEND_KILLED: -3,
}

module.exports.WORD_COLORS_B_S = [
    "rgb(255, 0, 0)",
    "rgb(0, 0, 0)",
    "rgb(112, 112, 112)",
    "rgb(150, 0, 0)",
    /*"rgb(48, 255, 0)",
    
    "rgb(255, 120, 0)",
    "rgb(91, 102, 0)",
    "rgb(196, 196, 196)",
    "rgb(126, 39, 0)",
    "rgb(222, 52, 0)",*/
]

//-------GLOBAL VARS -----------------------------

//-----------------image resources global-------------
var IMAGE_RESOURCES = {};
//--------------------------------------------------

//----------END GLOBAL VARS------------------

//-----------------------PATHS--------------------------------
var GLOBAL_PATH = "./assets/";

//----------------------image data-------------------------

const target1Data = { path: GLOBAL_PATH + "images/targets/_alien3.png", name: "IMG_ENEMY_ALIEN3" };
const target2Data = { path: GLOBAL_PATH + "images/targets/_alien4.png", name: "IMG_ENEMY_ALIEN4" };
const target3Data = { path: GLOBAL_PATH + "images/targets/_alien6.png", name: "IMG_ENEMY_ALIEN6" };
const target4Data = { path: GLOBAL_PATH + "images/targets/_alien7.png", name: "IMG_ENEMY_ALIEN7" };
const target5Data = { path: GLOBAL_PATH + "images/targets/_alien10.png", name: "IMG_ENEMY_ALIEN10" };
const target6Data = { path: GLOBAL_PATH + "images/targets/_alienBoy2.png", name: "IMG_ENEMY_ALIEN_BOY2" };
const target7Data = { path: GLOBAL_PATH + "images/targets/_alienBoy4.png", name: "IMG_ENEMY_ALIEN_BOY4" };
const target8Data = { path: GLOBAL_PATH + "images/targets/_alienBoy6.png", name: "IMG_ENEMY_ALIEN_BOY6" };
const target9Data = { path: GLOBAL_PATH + "images/targets/_buhal1.png", name: "IMG_ENEMY_BUHAL1" };
const target10Data = { path: GLOBAL_PATH + "images/targets/_buhal2.png", name: "IMG_ENEMY_BUHAL2" };
const target11Data = { path: GLOBAL_PATH + "images/targets/_croc1.png", name: "IMG_ENEMY_CROC1" };
const target12Data = { path: GLOBAL_PATH + "images/targets/_demon5.png", name: "IMG_ENEMY_DEMON5" };
const target13Data = { path: GLOBAL_PATH + "images/targets/_devil1.png", name: "IMG_ENEMY_DEVIL1" };
const target14Data = { path: GLOBAL_PATH + "images/targets/_devil3.png", name: "IMG_ENEMY_DEVIL3" };
const target15Data = { path: GLOBAL_PATH + "images/targets/_devil4.png", name: "IMG_ENEMY_DEVIL4" };
const target16Data = { path: GLOBAL_PATH + "images/targets/_doggie1.png", name: "IMG_ENEMY_DOGGIE1" };
const target17Data = { path: GLOBAL_PATH + "images/targets/_doggie4.png", name: "IMG_ENEMY_DOGGIE4" };
const target18Data = { path: GLOBAL_PATH + "images/targets/_dragon1.png", name: "IMG_ENEMY_DRAGON1" };
const target19Data = { path: GLOBAL_PATH + "images/targets/_girl1.png", name: "IMG_ENEMY_GIRL1" };
const target20Data = { path: GLOBAL_PATH + "images/targets/_girl3.png", name: "IMG_ENEMY_GIRL3" };
const target21Data = { path: GLOBAL_PATH + "images/targets/_girl5.png", name: "IMG_ENEMY_GIRL5" };
const target22Data = { path: GLOBAL_PATH + "images/targets/_girl11.png", name: "IMG_ENEMY_GIRL11" };
const target23Data = { path: GLOBAL_PATH + "images/targets/_girl12.png", name: "IMG_ENEMY_GIRL12" };
const target24Data = { path: GLOBAL_PATH + "images/targets/_girl13.png", name: "IMG_ENEMY_GIRL13" };
const target25Data = { path: GLOBAL_PATH + "images/targets/_girl14.png", name: "IMG_ENEMY_GIRL14" };
const target26Data = { path: GLOBAL_PATH + "images/targets/_girl15.png", name: "IMG_ENEMY_GIRL15" };
const target27Data = { path: GLOBAL_PATH + "images/targets/_madProf2.png", name: "IMG_ENEMY_MAD_PROF2" };
const target28Data = { path: GLOBAL_PATH + "images/targets/_tree4.png", name: "IMG_ENEMY_TREE4" };
const target29Data = { path: GLOBAL_PATH + "images/targets/_witch1.png", name: "IMG_ENEMY_WITCH1" };
const target30Data = { path: GLOBAL_PATH + "images/targets/_wolverine1.png", name: "IMG_ENEMY_WOLVERINE1" };
const target31Data = { path: GLOBAL_PATH + "images/targets/_zaek3.png", name: "IMG_ENEMY_ZAEK3" };
const target32Data = { path: GLOBAL_PATH + "images/targets/_zaek4.png", name: "IMG_ENEMY_ZAEK4" };
const target33Data = { path: GLOBAL_PATH + "images/targets/_zombie3.png", name: "IMG_ENEMY_ZOMBIE3" };
const target34Data = { path: GLOBAL_PATH + "images/targets/_bat3.png", name: "IMG_ENEMY_BAT3" };
const target35Data = { path: GLOBAL_PATH + "images/targets/bird2.png", name: "IMG_FRIEND_BIRD2" };
const target36Data = { path: GLOBAL_PATH + "images/targets/boy3.png", name: "IMG_FRIEND_BOY3" };
const target37Data = { path: GLOBAL_PATH + "images/targets/boy4.png", name: "IMG_FRIEND_BOY4" };
const target38Data = { path: GLOBAL_PATH + "images/targets/buhal1.png", name: "IMG_FRIEND_BUHAL1" };
const target39Data = { path: GLOBAL_PATH + "images/targets/buhal2.png", name: "IMG_FRIEND_BUHAL2" };
const target40Data = { path: GLOBAL_PATH + "images/targets/cuteDragon1.png", name: "IMG_FRIEND_CUTE_DRAGON1" };
const target41Data = { path: GLOBAL_PATH + "images/targets/cuteDragon2.png", name: "IMG_FRIEND_CUTE_DRAGON2" };
const target42Data = { path: GLOBAL_PATH + "images/targets/fox1.png", name: "IMG_FRIEND_CUTE_FOX1" };
const target43Data = { path: GLOBAL_PATH + "images/targets/fox3.png", name: "IMG_FRIEND_CUTE_FOX3" };
const target44Data = { path: GLOBAL_PATH + "images/targets/girl1.png", name: "IMG_FRIEND_CUTE_GIRL1" };
const target45Data = { path: GLOBAL_PATH + "images/targets/girl2.png", name: "IMG_FRIEND_CUTE_GIRL2" };
const target46Data = { path: GLOBAL_PATH + "images/targets/hamster2.png", name: "IMG_FRIEND_HAMSTER2" };
const target47Data = { path: GLOBAL_PATH + "images/targets/kuchence1.png", name: "IMG_FRIEND_KUCHENCE1" };
const target48Data = { path: GLOBAL_PATH + "images/targets/kuchence2.png", name: "IMG_FRIEND_KUCHENCE2" };
const target49Data = { path: GLOBAL_PATH + "images/targets/zaek5.png", name: "IMG_FRIEND_ZAEK5" };
const target50Data = { path: GLOBAL_PATH + "images/targets/zaek9.png", name: "IMG_FRIEND_ZAEK9" };
const target51Data = { path: GLOBAL_PATH + "images/targets/bird1.png", name: "IMG_FRIEND_BIRD1" };
const target52Data = { path: GLOBAL_PATH + "images/utils/check.png", name: "IMG_UTILS_CHECK" };
const target53Data = { path: GLOBAL_PATH + "images/utils/x.png", name: "IMG_UTILS_X" };
const target54Data = { path: GLOBAL_PATH + "images/utils/excl.png", name: "IMG_UTILS_EXCL" };
const mbox = { path: GLOBAL_PATH + "images/mbox.png", name: "IMG_MBOX" };
const mboxOk1 = { path: GLOBAL_PATH + "images/ok1.png", name: "IMG_MBOX_OK1" };
const mboxOk2 = { path: GLOBAL_PATH + "images/ok2.png", name: "IMG_MBOX_OK2" };
const strechUpLeft = { path: GLOBAL_PATH + "images/infoblock/upLeft.png", name: "STRECH_UP_LEFT" };
const strechUpMiddle = { path: GLOBAL_PATH + "images/infoblock/upMiddle.png", name: "STRECH_UP_MIDDLE" };
const strechUpRight = { path: GLOBAL_PATH + "images/infoblock/upRight.png", name: "STRECH_UP_RIGHT" };
const strechMiddleLeft = { path: GLOBAL_PATH + "images/infoblock/middleLeft.png", name: "STRECH_MIDDLE_LEFT" };
const strechMiddleMiddle = { path: GLOBAL_PATH + "images/infoblock/middleMiddle.png", name: "STRECH_MIDDLE_MIDDLE" };
const strechMiddleRight = { path: GLOBAL_PATH + "images/infoblock/middleRight.png", name: "STRECH_MIDDLE_RIGHT" };
const strechBottomLeft = { path: GLOBAL_PATH + "images/infoblock/bottomLeft.png", name: "STRECH_BOTTOM_LEFT" };
const strechBottomMiddle = { path: GLOBAL_PATH + "images/infoblock/bottomMiddle.png", name: "STRECH_BOTTOM_MIDDLE" };
const strechBottomRight = { path: GLOBAL_PATH + "images/infoblock/bottomRight.png", name: "STRECH_BOTTOM_RIGHT" };

//-----------------------------end image data-------------------

//-------------------------------texts paths------------------------
var INSULTS_BG_PATH = GLOBAL_PATH + "texts/insults_male.txt";
var INSULTS_EN_PATH = GLOBAL_PATH + "texts/insults_female.txt";
var COMPLIMENTS_BG_PATH = GLOBAL_PATH + "texts/compliments_male.txt";
var COMPLIMENTS_EN_PATH = GLOBAL_PATH + "texts/compliments_female.txt";

var TRANSLATIONS_PATH = GLOBAL_PATH + "texts/translations.txt"
//-------------------------------end texts paths------------------------

//-----------------------------sounds paths----------------------------

var ALIEN1_PATH = GLOBAL_PATH + "sounds/alien1.wav";
var SAD1_PATH = GLOBAL_PATH + "sounds/sad1.wav";
var ALIEN_ATTACK1_PATH = GLOBAL_PATH + "sounds/alienAttack1.wav";
var ALIEN_ATTACK2_PATH = GLOBAL_PATH + "sounds/alienAttack2.wav";
var ALIEN_ATTACK3_PATH = GLOBAL_PATH + "sounds/alienAttack3.wav";
var ALIEN_ATTACK4_PATH = GLOBAL_PATH + "sounds/alienAttack4.wav";
var ALIEN_ATTACK5_PATH = GLOBAL_PATH + "sounds/alienAttack5.wav";
var ALIEN_ATTACK6_PATH = GLOBAL_PATH + "sounds/alienAttack6.wav";
var ALIEN_ATTACK7_PATH = GLOBAL_PATH + "sounds/alienAttack7.wav";
var POP_UP_PATH = GLOBAL_PATH + "sounds/popUp.wav";
var GAME_OVER_PATH = GLOBAL_PATH + "sounds/gameOver.wav";


//-----------------------------Paths and names configuration array-------------------

module.exports.RESOURCES_CONFIGURATION = [
    { path: INSULTS_BG_PATH, name: "insults_male" },
    { path: INSULTS_EN_PATH, name: "insults_female" },
    { path: COMPLIMENTS_BG_PATH, name: "compliments_male" },
    { path: COMPLIMENTS_EN_PATH, name: "compliments_female" },
    { path: TRANSLATIONS_PATH, name: "translations" },
    { path: ALIEN1_PATH, name: "SOUND_alien1" },
    { path: SAD1_PATH, name: "SOUND_sad1" },
    { path: ALIEN_ATTACK1_PATH, name: "SOUND_alien_atack1" },
    { path: ALIEN_ATTACK2_PATH, name: "SOUND_alien_atack2" },
    { path: ALIEN_ATTACK3_PATH, name: "SOUND_alien_atack3" },
    { path: ALIEN_ATTACK4_PATH, name: "SOUND_alien_atack4" },
    { path: ALIEN_ATTACK5_PATH, name: "SOUND_alien_atack5" },
    { path: ALIEN_ATTACK6_PATH, name: "SOUND_alien_atack6" },
    { path: ALIEN_ATTACK7_PATH, name: "SOUND_alien_atack7" },
    { path: POP_UP_PATH, name: "SOUND_pop_up" },
    { path: GAME_OVER_PATH, name: "SOUND_game_over" },
    target1Data,
    target2Data,
    target3Data,
    target4Data,
    target5Data,
    target6Data,
    target7Data,
    target8Data,
    target9Data,
    target10Data,
    target11Data,
    target12Data,
    target13Data,
    target14Data,
    target15Data,
    target16Data,
    target17Data,
    target18Data,
    target19Data,
    target20Data,
    target21Data,
    target22Data,
    target23Data,
    target24Data,
    target25Data,
    target26Data,
    target27Data,
    target28Data,
    target29Data,
    target30Data,
    target31Data,
    target32Data,
    target33Data,
    target34Data,
    target35Data,
    target36Data,
    target37Data,
    target38Data,
    target39Data,
    target40Data,
    target41Data,
    target42Data,
    target43Data,
    target44Data,
    target45Data,
    target46Data,
    target47Data,
    target48Data,
    target49Data,
    target50Data,
    target51Data,
    target52Data,
    target53Data,
    target54Data,
    mbox,
    mboxOk1,
    mboxOk2,
    strechUpLeft,
    strechUpMiddle,
    strechUpRight,
    strechMiddleLeft,
    strechMiddleMiddle,
    strechMiddleRight,
    strechBottomLeft,
    strechBottomMiddle,
    strechBottomRight,
]

//------------------------END PATHS--------------------------------------

module.exports.getShadeOfColor = function (range) {
    const R = range[0];
    const G = range[1];
    const B = range[2];

    var R_Shade = 0;
    var G_Shade = 0;
    var B_Shade = 0;

    if (R) {
        R_Shade = Math.random() * (R[1] - R[0]) + R[0];
    }

    if (G) {
        G_Shade = Math.random() * (G[1] - G[0]) + G[0];
    }

    if (B) {
        B_Shade = Math.random() * (B[1] - B[0]) + B[0];
    }

    return `rgb(${R_Shade}, ${G_Shade}, ${B_Shade})`;
}

module.exports.degreesToRadians = function (degrees) {
    return degrees * (Math.PI / 180);
}

module.exports.radiansToDegrees = function (radians) {
    return radians * (180 / Math.PI);
}

module.exports.decToHexColor = function (R, G, B) {
    var rHex = R.toString(16);
    var gHex = G.toString(16);
    var bHex = B.toString(16);

    return "0x" + rHex + gHex + bHex;
}

module.exports.CE = function (tagName, className, parentContainer, id) {
    var element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    if (id) {
        element.id = id;
    }
    if (parentContainer) {
        parentContainer.appendChild(element);
    }

    return element;
}