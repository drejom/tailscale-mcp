# Tailscale MCP Server

A modern [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides seamless integration with Tailscale's CLI commands and REST API, enabling automated network management and monitoring through a standardized interface.

## 📦 Available Packages

- **NPM**: [`@hexsleeves/tailscale-mcp-server`](https://www.npmjs.com/package/@hexsleeves/tailscale-mcp-server)
- **Docker Hub**: [`hexsleeves/tailscale-mcp-server`](https://hub.docker.com/r/hexsleeves/tailscale-mcp-server)
- **GitHub Container Registry**: [`ghcr.io/hexsleeves/tailscale-mcp-server`](https://github.com/users/HexSleeves/packages/container/package/tailscale-mcp-server)

## Features

- **Device Management**: List, authorize, deauthorize, and manage Tailscale devices
- **Network Operations**: Connect/disconnect, manage routes, and monitor network status
- **Security Controls**: Manage ACLs, device tags, and network lock settings
- **Modern Architecture**: Modular tool system with TypeScript and Zod validation
- **CLI Integration**: Direct integration with Tailscale CLI commands
- **API Integration**: REST API support for advanced operations

## Quick Start

### Option 1: NPX (Recommended)

Run directly without installation:

```bash
# Method 1: Explicit package syntax (most reliable)
npx --package=@hexsleeves/tailscale-mcp-server tailscale-mcp-server

# Method 2: Direct syntax (may work depending on npx version)
npx -y @hexsleeves/tailscale-mcp-server
```

> **Note**: Method 1 with `--package=` syntax is more reliable across different npx versions and environments.

Or install globally:

```bash
npm install -g @hexsleeves/tailscale-mcp-server
tailscale-mcp-server
```

### Option 2: Docker

#### Docker Hub

```bash
# Pull and run from Docker Hub
docker run -d \
  --name tailscale-mcp \
  -e TAILSCALE_API_KEY=your_api_key \
  -e TAILSCALE_TAILNET=your_tailnet \
  hexsleeves/tailscale-mcp-server:latest
```

#### GitHub Container Registry

```bash
# Pull and run from GitHub Container Registry
docker run -d \
  --name tailscale-mcp \
  -e TAILSCALE_API_KEY=your_api_key \
  -e TAILSCALE_TAILNET=your_tailnet \
  ghcr.io/hexsleeves/tailscale-mcp-server:latest
```

#### Docker Compose

```bash
# Use the included docker-compose.yml
docker-compose up -d
```

## Configuration

### Claude Desktop

Add to your Claude Desktop configuration (`~/.claude/claude_desktop_config.json`):

#### Using NPX (Recommended)

```json
{
  "mcpServers": {
    "tailscale": {
      "command": "npx",
      "args": [
        "--package=@hexsleeves/tailscale-mcp-server",
        "tailscale-mcp-server"
      ],
      "env": {
        "TAILSCALE_API_KEY": "your-api-key-here",
        "TAILSCALE_TAILNET": "your-tailnet-name"
      }
    }
  }
}
```

#### Using Docker Hub

```json
{
  "mcpServers": {
    "tailscale": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "TAILSCALE_API_KEY=xxxxxxxxxxxxx",
        "-e",
        "TAILSCALE_TAILNET=your-tailnet",
        "hexsleeves/tailscale-mcp-server:latest"
      ]
    }
  }
}
```

#### Using GitHub Container Registry

```json
{
  "mcpServers": {
    "tailscale-docker": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "TAILSCALE_API_KEY=xxxxxxxxxxxxx",
        "-e",
        "TAILSCALE_TAILNET=your-tailnet",
        "ghcr.io/hexsleeves/tailscale-mcp-server:latest"
      ]
    }
  }
}
```

### Environment Variables

```bash
# Required for API operations
export TAILSCALE_API_KEY="your-api-key"
export TAILSCALE_TAILNET="your-tailnet"

# Optional: Custom API base URL
export TAILSCALE_API_BASE_URL="https://api.tailscale.com"

# Optional: Logging configuration
export LOG_LEVEL="1"  # 0=DEBUG, 1=INFO, 2=WARN, 3=ERROR
export MCP_SERVER_LOG_FILE="tailscale-mcp-{timestamp}.log"  # Enable file logging
```

## Available Tools

### Device Management

- `list_devices` - List all devices in the Tailscale network
- `device_action` - Perform actions on specific devices (authorize, deauthorize, delete, expire-key)
- `manage_routes` - Enable or disable routes for devices

### Network Operations

- `get_network_status` - Get current network status from Tailscale CLI
- `connect_network` - Connect to the Tailscale network
- `disconnect_network` - Disconnect from the Tailscale network
- `ping_peer` - Ping a peer device

### System Information

- `get_version` - Get Tailscale version information
- `get_tailnet_info` - Get detailed network information

## Development

### Local Development Setup

For local development and testing, clone the repository and set up the development environment:

```bash
# Clone the repository
git clone https://github.com/HexSleeves/tailscale-mcp-server.git
cd tailscale-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

### Environment Setup

#### Quick Setup (Recommended)

```bash
# Copy the example environment file
cp .env.example .env

# Create logs directory
mkdir -p logs

# Edit .env with your actual Tailscale credentials
# TAILSCALE_API_KEY=your-actual-api-key
# TAILSCALE_TAILNET=your-actual-tailnet
```

The `.env.example` file contains all available configuration options with documentation. Key variables for testing:

- **TAILSCALE_API_KEY**: Get from [Tailscale Admin Console](https://login.tailscale.com/admin/settings/keys)
- **TAILSCALE_TAILNET**: Your organization/tailnet name
- **LOG_LEVEL**: Set to `0` for debug logging during development
- **MCP_SERVER_LOG_FILE**: Enable server logging to file
- **MCP_LOG_FILE**: Enable test script logging to file

### Local Connection to Claude Desktop

For development, configure Claude Desktop to use your local build:

#### Option 1: Direct Node Execution

```json
{
  "mcpServers": {
    "tailscale-dev": {
      "command": "node",
      "args": ["/path/to/your/tailscale-mcp-server/dist/index.js"],
      "env": {
        "TAILSCALE_API_KEY": "your-api-key-here",
        "TAILSCALE_TAILNET": "your-tailnet-name",
        "LOG_LEVEL": "0"
      }
    }
  }
}
```

#### Option 2: NPM Script

```json
{
  "mcpServers": {
    "tailscale-dev": {
      "command": "npm",
      "args": ["run", "start"],
      "cwd": "/path/to/your/tailscale-mcp-server",
      "env": {
        "TAILSCALE_API_KEY": "your-api-key-here",
        "TAILSCALE_TAILNET": "your-tailnet-name",
        "LOG_LEVEL": "0"
      }
    }
  }
}
```

### Development Commands

```bash
# Build for development
npm run build:dev

# Build and watch for changes
npm run build:watch

# Run in development mode with auto-restart
npm run dev

# Run with auto-rebuild (watch mode)
npm run dev:watch

# Run directly with tsx (fastest for development)
npm run dev:direct

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only (requires Tailscale CLI)
npm run test:integration

# Run tests in watch mode
npm run test:watch
npm run test:unit:watch
npm run test:integration:watch

# Run tests with coverage
npm run test:coverage
npm run test:unit:coverage
npm run test:integration:coverage

# Run tests for CI (non-interactive)
npm run test:ci
npm run test:unit:ci
npm run test:integration:ci

# Test with MCP Inspector
npm run inspector

# Quality assurance (typecheck + unit tests + lint)
npm run qa

# Full quality assurance (typecheck + all tests + lint)
npm run qa:full

# Type checking
npm run typecheck

# Lint code (placeholder - needs setup)
npm run lint

# Format code (placeholder - needs setup)
npm run format
```

### Testing Strategy

This project uses a comprehensive testing strategy with separate unit and integration test suites:

#### Unit Tests

- **Purpose**: Test individual components in isolation
- **Location**: `src/__test__/**/*.test.ts`
- **Configuration**: `jest.config.unit.ts`
- **Requirements**: No external dependencies
- **Speed**: Fast execution
- **Coverage**: Focus on business logic, utilities, and pure functions

#### Integration Tests

- **Purpose**: Test CLI integration and real Tailscale interactions
- **Location**: `src/__test__/**/*.integration.test.ts`
- **Configuration**: `jest.config.integration.ts`
- **Requirements**: Tailscale CLI installed
- **Speed**: Slower execution
- **Coverage**: End-to-end workflows and CLI security

#### Running Tests Locally

**Prerequisites for Integration Tests:**

```bash
# Install Tailscale CLI (macOS)
brew install tailscale

# Install Tailscale CLI (Ubuntu/Debian)
curl -fsSL https://tailscale.com/install.sh | sh

# Verify installation
tailscale version
```

**Test Execution:**

```bash
# Quick unit tests (no external dependencies)
npm run test:unit

# Full integration tests (requires Tailscale CLI)
npm run test:integration

# All tests with coverage report
npm run test:coverage
```

#### CI/CD Testing

The project uses GitHub Actions with separate jobs for different test types:

1. **Unit Tests**: Run on Node.js 18, 20, and 22
2. **Integration Tests**: Run with Tailscale CLI installed and configured
3. **Security Tests**: Validate CLI input sanitization
4. **Coverage Reports**: Uploaded to Codecov

**CI Configuration Features:**

- Tailscale CLI installation and setup
- Optional Tailscale authentication for full integration testing
- Separate coverage reports for unit and integration tests
- Proper cleanup of Tailscale connections
- Matrix testing across Node.js versions

#### Test Organization

```bash
src/__test__/
├── setup.ts                           # Global test setup
├── setup.integration.ts               # Integration test setup
├── utils/
│   └── logger.test.ts                 # Unit tests for utilities
├── tailscale/
│   └── cli-security.test.integration.ts  # Integration security tests
└── tools/
    └── *.test.ts                      # Tool unit tests
```

#### Writing Tests

**Unit Test Example:**

```typescript
// src/__test__/utils/example.test.ts
import { ExampleClass } from "../../utils/example";

describe("ExampleClass", () => {
  test("should perform expected behavior", () => {
    const instance = new ExampleClass();
    expect(instance.method()).toBe("expected");
  });
});
```

**Integration Test Example:**

```typescript
// src/__test__/tailscale/example.integration.test.ts
import { TailscaleCLI } from "../../tailscale/tailscale-cli";

describe("TailscaleCLI Integration", () => {
  test("should validate CLI security", async () => {
    const cli = new TailscaleCLI();
    await expect(cli.ping("invalid; rm -rf /")).rejects.toThrow();
  });
});
```

#### Test Utilities

The integration test setup provides utilities for conditional test execution:

```typescript
// Skip tests if Tailscale CLI is not available
global.integrationTestUtils.skipIfNoTailscale()("should test CLI", () => {
  // Test implementation
});

// Skip tests if not logged into Tailscale
global.integrationTestUtils.skipIfNotLoggedIn()("should test network", () => {
  // Test implementation
});
```

### NPM Scripts Reference

The project includes a comprehensive set of npm scripts organized by workflow:

#### Development Workflow

```bash
# Build commands
npm run clean              # Clean dist directory
npm run build              # Production build
npm run build:dev          # Development build
npm run build:watch        # Build with file watching

# Development servers
npm run start              # Start built application
npm run dev                # Build and start in development mode
npm run dev:watch          # Development with auto-rebuild
npm run dev:direct         # Direct execution with tsx (fastest)

# Quality assurance
npm run typecheck          # TypeScript type checking
npm run qa                 # Quick QA: typecheck + unit tests + lint
npm run qa:full            # Full QA: typecheck + all tests + lint
```

#### Testing Workflow

```bash
# Basic testing
npm run test               # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only

# Development testing
npm run test:watch         # All tests in watch mode
npm run test:unit:watch    # Unit tests in watch mode
npm run test:integration:watch # Integration tests in watch mode

# Coverage reports
npm run test:coverage      # All tests with coverage
npm run test:unit:coverage # Unit test coverage
npm run test:integration:coverage # Integration test coverage

# CI testing
npm run test:ci            # All tests for CI
npm run test:unit:ci       # Unit tests for CI
npm run test:integration:ci # Integration tests for CI

# Environment setup
npm run test:setup         # Setup testing environment
```

#### Code Quality (Future)

```bash
npm run lint               # Lint code (needs ESLint setup)
npm run format             # Format code (needs Prettier setup)
```

#### Publishing Workflow

```bash
npm run publish            # Interactive publish script
npm run publish:test       # Test publish process
npm run inspector          # Test with MCP Inspector
```

#### Recommended Development Workflow

1. **Initial Setup**: `npm run test:setup`
2. **Development**: `npm run dev:direct` or `npm run dev:watch`
3. **Quick Check**: `npm run qa` (before commits)
4. **Full Validation**: `npm run qa:full` (before PRs)
5. **Publishing**: `npm run publish`

### Publishing

The project includes an interactive publishing script that handles version bumping and publishing to multiple registries:

```bash
# Run the interactive publish script
npm run publish

# Or run directly
./scripts/publish.sh
```

The script will guide you through:

1. **Version Bumping**: Choose between patch, minor, major, or skip
2. **NPM Publishing**: Optionally publish to npm registry
3. **Docker Hub**: Optionally build and publish Docker images
4. **GitHub Container Registry**: Optionally publish to GHCR
5. **Git Operations**: Automatically commit version changes and create tags

#### Publishing Features

- **Interactive prompts** for each publishing step
- **Automatic version bumping** with semantic versioning
- **Git integration** with automatic tagging and commits
- **Multi-registry support** (npm, Docker Hub, GHCR)
- **Safety checks** for uncommitted changes
- **Colored output** for better visibility
- **Error handling** with proper exit codes
- **Performance optimized** with pre-calculated version previews

#### Prerequisites for Publishing

- **NPM**: Logged in with `npm login` and proper access to the package
- **Docker Hub**: Logged in with `docker login`
- **GHCR**: Logged in with `docker login ghcr.io` using a GitHub token
- **Git**: Clean working directory (or confirmation to proceed with uncommitted changes)

### Docker Development

For Docker-based development:

```bash
# Build development image
docker build -t tailscale-mcp-dev .

# Run with development environment
docker run -it --rm \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e TAILSCALE_API_KEY=your_api_key \
  -e TAILSCALE_TAILNET=your_tailnet \
  -e LOG_LEVEL=0 \
  tailscale-mcp-dev

# Or use Docker Compose for development
docker-compose -f docker-compose.dev.yml up
```

### Project Structure

```bash
src/
├── server.ts              # Main server implementation
├── tools/                 # Modular tool definitions
│   ├── index.ts           # Tool registry system
│   ├── device-tools.ts    # Device management tools
│   └── ...                # Additional tool modules
├── tailscale/             # Tailscale integrations
│   ├── tailscale-api.ts   # REST API client
│   ├── tailscale-cli.ts   # CLI wrapper
│   └── index.ts           # Exports
├── types.ts               # Type definitions
├── logger.ts              # Logging utilities
└── index.ts               # Entry point
```

### Adding New Tools

1. Create a new tool module in `src/tools/`:

```typescript
import { z } from "zod";
import type { ToolModule, ToolContext } from "./index.js";

const MyToolSchema = z.object({
  param: z.string().describe("Description of parameter"),
});

async function myTool(
  args: z.infer<typeof MyToolSchema>,
  context: ToolContext,
) {
  // Implementation
  return {
    content: [{ type: "text", text: "Result" }],
  };
}

export const myTools: ToolModule = {
  tools: [
    {
      name: "my_tool",
      description: "Description of what this tool does",
      inputSchema: MyToolSchema,
      handler: myTool,
    },
  ],
};
```

2. Register the module in `src/server.ts`:

```typescript
import { myTools } from "./tools/my-tools.js";

// In the constructor:
this.toolRegistry.registerModule(myTools);
```

### Debugging

Enable debug logging for development:

```bash
# Set environment variable
export LOG_LEVEL=0

# Or in .env file
LOG_LEVEL=0
MCP_SERVER_LOG_FILE=debug-{timestamp}.log
```

View logs in real-time:

```bash
# Follow server logs
tail -f logs/debug-*.log

# Or use Docker logs
docker-compose logs -f tailscale-mcp
```

## API Reference

### Environment Variables

| Variable                 | Description                                 | Required | Default                     |
| ------------------------ | ------------------------------------------- | -------- | --------------------------- |
| `TAILSCALE_API_KEY`      | Tailscale API key                           | Yes\*    | -                           |
| `TAILSCALE_TAILNET`      | Tailscale tailnet name                      | Yes\*    | -                           |
| `TAILSCALE_API_BASE_URL` | API base URL                                | No       | `https://api.tailscale.com` |
| `LOG_LEVEL`              | Logging level (0-3)                         | No       | `1` (INFO)                  |
| `MCP_SERVER_LOG_FILE`    | Server log file path (supports {timestamp}) | No       | -                           |

\*Required for API-based operations. CLI operations work without API credentials.

### Tool Categories

#### Device Tools

- Device listing and filtering
- Device authorization management
- Route management per device

#### Network Tools

- Network status monitoring
- Connection management
- Peer connectivity testing

#### Security Tools

- ACL management
- Device tagging
- Network lock operations

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Add Zod schemas for input validation
- Include tests for new tools
- Follow the existing modular architecture
- Update documentation for new features

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- [Issues](https://github.com/your-repo/issues) - Bug reports and feature requests
- [Discussions](https://github.com/your-repo/discussions) - Questions and community support
- [MCP Documentation](https://modelcontextprotocol.io) - Learn more about MCP

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.
