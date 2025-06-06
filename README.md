# Tailscale MCP Server

A modern [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides seamless integration with Tailscale's CLI commands and REST API, enabling automated network management and monitoring through a standardized interface.

## Features

- **Device Management**: List, authorize, deauthorize, and manage Tailscale devices
- **Network Operations**: Connect/disconnect, manage routes, and monitor network status
- **Security Controls**: Manage ACLs, device tags, and network lock settings
- **Modern Architecture**: Modular tool system with TypeScript and Zod validation
- **CLI Integration**: Direct integration with Tailscale CLI commands
- **API Integration**: REST API support for advanced operations

## Quick Start

### Installation

```bash
# Install globally
npm install -g @hexsleeve/tailscale-mcp-server

# Or run directly
npx @hexsleeve/tailscale-mcp-server
```

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd TailscaleMcp

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Configuration

#### Claude Desktop

Add to your Claude Desktop configuration (`~/.claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "tailscale": {
      "command": "npx",
      "args": ["@hexsleeve/tailscale-mcp-server"],
      "env": {
        "TAILSCALE_API_KEY": "your-api-key-here",
        "TAILSCALE_TAILNET": "your-tailnet-name"
      }
    }
  }
}
```

#### Environment Variables

```bash
# Required for API operations
export TAILSCALE_API_KEY="your-api-key"
export TAILSCALE_TAILNET="your-tailnet"

# Optional: Custom API base URL
export TAILSCALE_API_BASE_URL="https://api.tailscale.com"
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
  context: ToolContext
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

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Test with MCP Inspector
npm run inspector
```

### Building

```bash
# Build for production
npm run build

# Build for development
npm run build:dev

# Build and watch for changes
npm run build:watch
```

## API Reference

### Environment Variables

| Variable                 | Description            | Required | Default                     |
| ------------------------ | ---------------------- | -------- | --------------------------- |
| `TAILSCALE_API_KEY`      | Tailscale API key      | Yes\*    | -                           |
| `TAILSCALE_TAILNET`      | Tailscale tailnet name | Yes\*    | -                           |
| `TAILSCALE_API_BASE_URL` | API base URL           | No       | `https://api.tailscale.com` |

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
