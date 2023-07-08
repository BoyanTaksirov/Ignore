module.exports = class Timer {
    constructor(milliseconds, callbacks) {
        this.milliseconds = milliseconds;
        this.callbacks = [];
    
        this.currentCount = 0;

        this.intervalID;

        this.setCallbacks(callbacks);

        this.onInterval = this.onInterval.bind(this);
    }

    setCallbacks(callbacks) {
        for (let i = 0; i < callbacks.length; i++) {
            const callbackObj = {
                func: callbacks[i].func,
                timeIntervalMsec: callbacks[i].timeIntervalMsec,
                lastRunTimeStamp: null,
            }

            this.callbacks.push(callbackObj);
        }
    }

    start() {
        this.reset();
        this.intervalID = setInterval(this.onInterval, this.milliseconds);
    }

    reset() {
        clearInterval(this.intervalID);
        this.intervalID = null;
        this.currentCount = 0;
    }

    onInterval() {
        this.currentCount++;

        const now = new Date();
        for (let i = 0; i < this.callbacks.length; i++) {
            if (!this.callbacks[i].lastRunTimeStamp) {
                this.callbacks[i].func();
                this.callbacks[i].lastRunTimeStamp = new Date();
            } else {
                const timePassedMsec = now - this.callbacks[i].lastRunTimeStamp;
                if (timePassedMsec >= this.callbacks[i].timeIntervalMsec) {
                    this.callbacks[i].func();
                    this.callbacks[i].lastRunTimeStamp = new Date();
                }
            }
        }
    }

    getCurrentCount() {
        return this.currentCount;
    }
}