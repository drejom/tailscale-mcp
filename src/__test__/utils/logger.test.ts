import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  spyOn,
  test,
} from "bun:test";
import { LogLevel, Logger } from "../../logger";

// Mock fs/promises
mock.module("fs/promises", () => ({
  writeFile: mock(() => Promise.resolve()),
  appendFile: mock(() => Promise.resolve()),
}));

describe("Logger", () => {
  let logger: Logger;
  let consoleSpy: Mock<typeof console.info>;

  beforeEach(() => {
    // Reset environment variables
    process.env.MCP_SERVER_LOG_FILE = undefined;

    // Create fresh spies for console methods
    consoleSpy = spyOn(console, "info").mockImplementation(() => {});
    spyOn(console, "debug").mockImplementation(() => {});
    spyOn(console, "warn").mockImplementation(() => {});
    spyOn(console, "error").mockImplementation(() => {});

    // Create a fresh logger instance with known level
    logger = new Logger(LogLevel.INFO);
  });

  afterEach(() => {
    // Restore all mocks
    mock.restore();
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
      const debugSpy = spyOn(console, "debug");

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
      const debugSpy = spyOn(console, "debug");
      logger.debug("test debug message");
      expect(debugSpy).not.toHaveBeenCalled();
    });

    test("should log warn messages", () => {
      const warnSpy = spyOn(console, "warn");
      logger.warn("test warning");
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("[WARN]"),
        "test warning",
      );
    });

    test("should log error messages", () => {
      const errorSpy = spyOn(console, "error");
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
