# Tailscale MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with Tailscale's CLI commands and REST API, enabling automated network management and monitoring through a standardized interface.

## Features

- **MCP Server Implementation**: Full compliance with the Model Context Protocol specification
- **Tailscale CLI Integration**: Execute Tailscale CLI commands programmatically
- **REST API Integration**: Manage devices and network settings via Tailscale's API
- **Comprehensive Tool Set**: 8 tools covering common network operations
- **Error Handling**: Robust error handling with detailed debugging information
- **TypeScript**: Full type safety with Zod validation
- **Logging**: Structured logging with configurable levels

## Available Tools

### Device Management
- **`list_devices`**: List all devices in the Tailscale network with optional route information
- **`device_action`**: Authorize, deauthorize, delete, or expire keys for devices
- **`manage_routes`**: Enable or disable subnet routes for specific devices

### Network Operations
- **`get_network_status`**: Get comprehensive network status (JSON or summary format)
- **`connect_network`**: Connect to Tailscale with configurable options
- **`disconnect_network`**: Disconnect from the Tailscale network
- **`ping_peer`**: Ping other devices in the network
- **`get_version`**: Get Tailscale version information

## Prerequisites

1. **Tailscale CLI**: Install the Tailscale CLI tool on your system
   ```bash
   # macOS
   brew install tailscale
   
   # Ubuntu/Debian
   curl -fsSL https://tailscale.com/install.sh | sh
   
   # Windows
   # Download from https://tailscale.com/download
   ```

2. **Tailscale API Key** (Optional for API operations):
   - Generate an API key from [Tailscale Admin Console](https://login.tailscale.com/admin/settings/keys)
   - Set the environment variable: `export TAILSCALE_API_KEY=your_api_key_here`

3. **Node.js**: Requires Node.js 18+ with ES module support

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npx tsc
   ```

## Usage

### Starting the MCP Server

The server can be started in two ways:

#### Method 1: Direct execution
```bash
node dist/index.js
```

#### Method 2: Using npm scripts (if available)
```bash
npm run build && npm start
```

### Configuration

#### Environment Variables

- `TAILSCALE_API_KEY`: Your Tailscale API key for device management operations
- `TAILSCALE_TAILNET`: Your tailnet name (defaults to 'default')
- `LOG_LEVEL`: Logging level (0=DEBUG, 1=INFO, 2=WARN, 3=ERROR)

#### Example Configuration
```bash
export TAILSCALE_API_KEY="tskey-api-xxxxxxxxx"
export TAILSCALE_TAILNET="mytailnet.com"
export LOG_LEVEL=1
node dist/index.js
```

## MCP Client Integration

This server implements the Model Context Protocol and can be used with any MCP-compatible client. The server communicates via stdio and provides tools for Tailscale network management.

### Example MCP Client Configuration

```json
{
  "mcpServers": {
    "tailscale": {
      "command": "node",
      "args": ["/path/to/tailscale-mcp-server/dist/index.js"],
      "env": {
        "TAILSCALE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Tool Reference

### Device Management Tools

#### `list_devices`
Lists all devices in your Tailscale network.

**Parameters:**
- `includeRoutes` (boolean, optional): Include subnet route information

**Example:**
```json
{
  "name": "list_devices",
  "arguments": {
    "includeRoutes": true
  }
}
```

#### `device_action`
Perform management actions on specific devices.

**Parameters:**
- `deviceId` (string, required): The device ID
- `action` (string, required): One of "authorize", "deauthorize", "delete", "expire-key"

**Example:**
```json
{
  "name": "device_action",
  "arguments": {
    "deviceId": "device-123",
    "action": "authorize"
  }
}
```

#### `manage_routes`
Enable or disable subnet routes for devices.

**Parameters:**
- `deviceId` (string, required): The device ID
- `routes` (array, required): Array of CIDR routes
- `action` (string, required): "enable" or "disable"

**Example:**
```json
{
  "name": "manage_routes",
  "arguments": {
    "deviceId": "device-123",
    "routes": ["10.0.1.0/24", "192.168.1.0/24"],
    "action": "enable"
  }
}
```

### Network Operations

#### `get_network_status`
Get current network status from Tailscale CLI.

**Parameters:**
- `format` (string, optional): "json" or "summary" (default: "json")

**Example:**
```json
{
  "name": "get_network_status",
  "arguments": {
    "format": "summary"
  }
}
```

#### `connect_network`
Connect to the Tailscale network with options.

**Parameters:**
- `acceptRoutes` (boolean, optional): Accept subnet routes
- `acceptDNS` (boolean, optional): Accept DNS configuration
- `hostname` (string, optional): Custom hostname
- `advertiseRoutes` (array, optional): Routes to advertise
- `authKey` (string, optional): Authentication key
- `loginServer` (string, optional): Custom coordination server

**Example:**
```json
{
  "name": "connect_network",
  "arguments": {
    "acceptRoutes": true,
    "acceptDNS": true,
    "advertiseRoutes": ["10.0.1.0/24"]
  }
}
```

#### `disconnect_network`
Disconnect from the Tailscale network.

**Parameters:** None

#### `ping_peer`
Ping another device in the network.

**Parameters:**
- `target` (string, required): Hostname or IP address
- `count` (number, optional): Number of packets (default: 4)

**Example:**
```json
{
  "name": "ping_peer",
  "arguments": {
    "target": "server1.tailnet.ts.net",
    "count": 5
  }
}
```

#### `get_version`
Get Tailscale version information.

**Parameters:** None

## Error Handling

The server provides comprehensive error handling:

- **Missing API Key**: CLI operations work without API key, but API operations will fail with helpful error messages
- **Network Issues**: Automatic retry and timeout handling
- **Invalid Parameters**: Schema validation with descriptive error messages
- **Tailscale CLI Issues**: Graceful degradation when CLI is unavailable

## Security Considerations

- API keys are handled securely and not logged
- All network operations require proper authentication
- Input validation prevents injection attacks
- Minimal required permissions for API operations

## Development

### Project Structure
```
src/
├── index.ts          # Main MCP server implementation
├── tailscale-api.ts  # Tailscale REST API client
├── tailscale-cli.ts  # Tailscale CLI wrapper
├── tools.ts          # MCP tool implementations
├── types.ts          # TypeScript type definitions
└── logger.ts         # Structured logging
```

### Building from Source
```bash
# Install dependencies
npm install

# Build TypeScript
npx tsc

# Run the server
node dist/index.js
```

### Testing
```bash
# Test server startup
timeout 3s node dist/index.js 2>&1

# Test with API key
TAILSCALE_API_KEY=your_key node dist/index.js
```

## Troubleshooting

### Common Issues

1. **"Module not found" errors**: Ensure `"type": "module"` is in package.json
2. **API authentication failures**: Verify your TAILSCALE_API_KEY is valid
3. **CLI command failures**: Check Tailscale CLI installation and login status
4. **Permission errors**: Ensure proper tailnet permissions for API operations

### Debug Mode
Enable debug logging:
```bash
LOG_LEVEL=0 node dist/index.js
```

## License

MIT License - see LICENSE file for details.
   