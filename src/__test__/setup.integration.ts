// Integration test setup file
import { beforeAll } from "bun:test";
import { execSync } from "node:child_process";

// Check if Tailscale CLI is available
beforeAll(async () => {
  try {
    // Check if tailscale command is available
    execSync("which tailscale", { stdio: "pipe" });
    console.log("✅ Tailscale CLI is available");
  } catch {
    console.error("❌ Tailscale CLI is not available");
    console.error("Please install Tailscale CLI to run integration tests");
    console.error("Visit: https://tailscale.com/download");
    process.exit(1);
  }

  try {
    // Check Tailscale status (don't require login for security tests)
    const status = execSync("tailscale status --json", {
      stdio: "pipe",
      encoding: "utf8",
    });
    const statusData = JSON.parse(status);
    console.log(`📡 Tailscale status: ${statusData.BackendState || "unknown"}`);
  } catch {
    // It's okay if Tailscale is not logged in for security tests
    console.log(
      "ℹ️  Tailscale CLI available but not logged in (this is fine for security tests)",
    );
  }
});

// Add integration test specific utilities
// global.integrationTestUtils = {
//   skipIfNoTailscale: (): Test => {
//     try {
//       execSync("which tailscale", { stdio: "pipe" });
//     } catch {
//       return test.skip;
//     }

//     return test;
//   },

//   skipIfNotLoggedIn: (): Test => {
//     try {
//       execSync("tailscale status", { stdio: "pipe" });
//     } catch {
//       return test.skip;
//     }
//     return test;
//   },
// };

// // Declare global types for TypeScript
// declare global {
//   var integrationTestUtils: {
//     skipIfNoTailscale: () => Test;
//     skipIfNotLoggedIn: () => Test;
//   };
// }
