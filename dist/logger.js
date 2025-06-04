export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
class Logger {
    level;
    constructor(level = LogLevel.INFO) {
        this.level = level;
    }
    setLevel(level) {
        this.level = level;
    }
    log(level, message, ...args) {
        if (level >= this.level) {
            const timestamp = new Date().toISOString();
            const levelName = LogLevel[level];
            const prefix = `[${timestamp}] [${levelName}]`;
            switch (level) {
                case LogLevel.DEBUG:
                    console.debug(prefix, message, ...args);
                    break;
                case LogLevel.INFO:
                    console.info(prefix, message, ...args);
                    break;
                case LogLevel.WARN:
                    console.warn(prefix, message, ...args);
                    break;
                case LogLevel.ERROR:
                    console.error(prefix, message, ...args);
                    break;
            }
        }
    }
    debug(message, ...args) {
        this.log(LogLevel.DEBUG, message, ...args);
    }
    info(message, ...args) {
        this.log(LogLevel.INFO, message, ...args);
    }
    warn(message, ...args) {
        this.log(LogLevel.WARN, message, ...args);
    }
    error(message, ...args) {
        this.log(LogLevel.ERROR, message, ...args);
    }
    // Helper method for structured logging
    logObject(level, message, obj) {
        this.log(level, message, JSON.stringify(obj, null, 2));
    }
}
// Export singleton instance
export const logger = new Logger(process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : LogLevel.INFO);
// Export class for custom instances
export { Logger };
//# sourceMappingURL=logger.js.map