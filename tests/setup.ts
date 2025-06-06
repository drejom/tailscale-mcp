// Jest setup file for global test configuration

// Set test timeout
jest.setTimeout(10000);

// Mock environment variables for tests
process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "3"; // ERROR level for tests

// Global test utilities can be added here
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: console.warn,
  error: console.error,
};
