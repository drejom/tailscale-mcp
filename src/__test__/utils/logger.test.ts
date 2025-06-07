import { Logger, LogLevel } from "../../logger";
import { jest } from "@jest/globals";

// Mock fs/promises
jest.mock("fs/promises", () => ({
  writeFile: jest.fn(),
  appendFile: jest.fn(),
}));

describe("Logger", () => {
  let logger: Logger;
  let consoleSpy: jest.SpiedFunction<typeof console.log>;

  beforeEach(() => {
    // Reset environment variables
    delete process.env.MCP_SERVER_LOG_FILE;

    // Clear all mocks from global setup
    jest.clearAllMocks();

    // Create fresh spies for console methods
    consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "debug").mockImplementation(() => {});
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Create a fresh logger instance with known level
    logger = new Logger(LogLevel.INFO);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
  });

  describe("constructor", () => {
    test("should create logger with default INFO level", () => {
      const defaultLogger = new Logger();
      expect(defaultLogger).toBeInstanceOf(Logger);
    });

    test("should create logger with specified level", () => {
      const debugLogger = new Logger(LogLevel.DEBUG);
      expect(debugLogger).toBeInstanceOf(Logger);
    });

    test("should not initialize file logging when MCP_SERVER_LOG_FILE is not set", () => {
      expect(process.env.MCP_SERVER_LOG_FILE).toBeUndefined();
      // Logger should still be created successfully
      expect(logger).toBeInstanceOf(Logger);
    });
  });

  describe("setLevel", () => {
    test("should update log level", () => {
      const debugSpy = jest.spyOn(console, "debug");

      // Initially at INFO level, debug should not log
      logger.debug("test debug message");
      expect(debugSpy).not.toHaveBeenCalled();

      // Change to DEBUG level, now debug should log
      logger.setLevel(LogLevel.DEBUG);
      logger.debug("test debug message after level change");
      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining("[DEBUG]"),
        "test debug message after level change",
      );
    });
  });

  describe("logging methods", () => {
    test("should log info messages when level is INFO", () => {
      logger.info("test info message");
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[INFO]"),
        "test info message",
      );
    });

    test("should not log debug messages when level is INFO", () => {
      const debugSpy = jest.spyOn(console, "debug");
      logger.debug("test debug message");
      expect(debugSpy).not.toHaveBeenCalled();
    });

    test("should log warn messages", () => {
      const warnSpy = jest.spyOn(console, "warn");
      logger.warn("test warning");
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("[WARN]"),
        "test warning",
      );
    });

    test("should log error messages", () => {
      const errorSpy = jest.spyOn(console, "error");
      logger.error("test error");
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("[ERROR]"),
        "test error",
      );
    });

    test("should format messages with additional arguments", () => {
      logger.info("test message", "arg1", { key: "value" });
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[INFO]"),
        "test message",
        "arg1",
        { key: "value" },
      );
    });
  });

  describe("logObject", () => {
    test("should log objects with proper formatting", () => {
      const testObj = { name: "test", value: 123 };
      logger.logObject(LogLevel.INFO, "Test object:", testObj);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[INFO]"),
        expect.stringContaining("Test object:"),
        expect.stringContaining(JSON.stringify(testObj, null, 2)),
      );
    });
  });

  describe("LogLevel enum", () => {
    test("should have correct numeric values", () => {
      expect(LogLevel.DEBUG).toBe(0);
      expect(LogLevel.INFO).toBe(1);
      expect(LogLevel.WARN).toBe(2);
      expect(LogLevel.ERROR).toBe(3);
    });

    test("should have correct string representations", () => {
      expect(LogLevel[LogLevel.DEBUG]).toBe("DEBUG");
      expect(LogLevel[LogLevel.INFO]).toBe("INFO");
      expect(LogLevel[LogLevel.WARN]).toBe("WARN");
      expect(LogLevel[LogLevel.ERROR]).toBe("ERROR");
    });
  });
});
