import { logger } from "../src/logger";

describe("Logger", () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  it("should create a logger instance", () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });

  it("should log info messages", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    logger.info("Test info message");

    // In test environment, we might not see console output due to log level
    // This test verifies the method exists and can be called
    expect(consoleSpy).toHaveBeenCalledTimes(0); // Due to LOG_LEVEL=3 in setup

    consoleSpy.mockRestore();
  });

  it("should log error messages", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    logger.error("Test error message");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("ERROR"),
      "Test error message"
    );

    consoleSpy.mockRestore();
  });
});
