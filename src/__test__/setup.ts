// Bun test setup file for global test configuration

// Mock environment variables for tests
process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "3"; // ERROR level for tests

// Global test utilities can be added here
// Note: Bun test handles console mocking differently than Jest
// We'll let individual tests handle console mocking as needed
