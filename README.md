# 🌐 Tailscale MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Tailscale](https://img.shields.io/badge/Tailscale-000000?style=for-the-badge&logo=tailscale&logoColor=white)](https://tailscale.com/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue?style=for-the-badge)](https://modelcontextprotocol.io/)

A powerful **Model Context Protocol (MCP) server** that provides seamless integration with Tailscale's CLI commands and REST API. Manage your entire Tailscale network programmatically through a standardized interface with full type safety and comprehensive error handling.

## ✨ Features

- 🔌 **Full MCP Compliance**: Complete Model Context Protocol implementation
- 🛠️ **Dual Integration**: Both Tailscale CLI and REST API support
- 🎯 **25+ Tools**: Comprehensive network management capabilities
- 🔒 **Enterprise Ready**: Advanced features like network lock, ACLs, and device posture
- 🛡️ **Type Safe**: Full TypeScript implementation with Zod validation
- 📊 **Rich Monitoring**: Network statistics, audit logs, and real-time status
- 🔄 **Auto-Discovery**: Intelligent device and network discovery
- 📝 **Structured Logging**: Configurable logging with detailed debugging

## 🚀 Quick Start

### Prerequisites

1. **Tailscale CLI** installed and authenticated:

   ```bash
   # macOS
   brew install tailscale

   # Ubuntu/Debian
   curl -fsSL https://tailscale.com/install.sh | sh

   # Windows - Download from https://tailscale.com/download
   ```

2. **Node.js 18+** with ES module support

3. **Tailscale API Key** (optional, for advanced features):

   ```bash
   export TAILSCALE_API_KEY="tskey-api-xxxxxxxxx"
   ```

### Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd tailscale-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Start the MCP server
npm start
```

### Development Mode

```bash
# Start with auto-rebuild on file changes
npm run dev:watch

# Or build once and run
npm run dev
```

## 🔧 MCP Client Integration

### Claude Desktop Configuration

Add to your Claude Desktop MCP configuration (`~/.config/claude-desktop/mcp.json`):

```json
{
  "mcpServers": {
    "tailscale": {
      "command": "node",
      "args": ["dist/index.js"],
      "cwd": "/path/to/tailscale-mcp",
      "env": {
        "TAILSCALE_API_KEY": "your_api_key_here",
        "LOG_LEVEL": "1"
      }
    }
  }
}
```

### VS Code/Cursor Integration

For development environments, you can integrate through:

- GitHub Copilot with MCP support
- Custom MCP client implementations
- Direct stdio communication

## 🛠️ Available Tools

### 📱 Device Management

| Tool                    | Description              | Key Features                                |
| ----------------------- | ------------------------ | ------------------------------------------- |
| `list_devices`          | List all network devices | Route info, online status, device details   |
| `device_action`         | Manage device lifecycle  | Authorize, deauthorize, delete, expire keys |
| `manage_routes`         | Control subnet routing   | Enable/disable routes, CIDR management      |
| `manage_device_tags`    | Organize with tags       | Tag-based organization and ACL targeting    |
| `manage_device_posture` | Device compliance        | OS version checks, software requirements    |

### 🌐 Network Operations

| Tool                 | Description                  | Key Features                             |
| -------------------- | ---------------------------- | ---------------------------------------- |
| `get_network_status` | Real-time network status     | JSON/summary formats, peer information   |
| `connect_network`    | Network connection           | Custom options, route advertising        |
| `disconnect_network` | Network disconnection        | Graceful shutdown                        |
| `ping_peer`          | Network connectivity testing | Latency testing, connection verification |
| `get_version`        | Version information          | CLI and daemon versions                  |

### 🚪 Exit Node & Routing

| Tool                | Description          | Key Features                         |
| ------------------- | -------------------- | ------------------------------------ |
| `manage_exit_nodes` | Exit node management | Set, clear, advertise routes         |
| `get_tailnet_info`  | Network information  | Detailed configuration, capabilities |

### 🔐 Security & Access Control

| Tool                  | Description          | Key Features                     |
| --------------------- | -------------------- | -------------------------------- |
| `manage_acl`          | Access Control Lists | Rule management, validation      |
| `manage_network_lock` | Network security     | Key authority, enhanced security |
| `manage_policy_file`  | Policy management    | HuJSON policies, access testing  |
| `manage_ssh`          | SSH configuration    | Remote access settings           |

### 🔑 Authentication & Keys

| Tool           | Description        | Key Features                       |
| -------------- | ------------------ | ---------------------------------- |
| `manage_keys`  | API key management | Create, list, delete auth keys     |
| `manage_users` | User management    | Roles, permissions, user lifecycle |

### 🌍 DNS & Networking

| Tool                  | Description           | Key Features                        |
| --------------------- | --------------------- | ----------------------------------- |
| `manage_dns`          | DNS configuration     | MagicDNS, nameservers, search paths |
| `manage_file_sharing` | File sharing settings | Enable/disable file sharing         |

### 📊 Monitoring & Analytics

| Tool                | Description           | Key Features                          |
| ------------------- | --------------------- | ------------------------------------- |
| `get_network_stats` | Network statistics    | Traffic analysis, performance metrics |
| `manage_logging`    | Logging configuration | Audit logs, log levels                |
| `manage_webhooks`   | Event notifications   | Webhook management, event streaming   |

## 💡 Usage Examples

### Basic Network Status

```typescript
// Get comprehensive network overview
{
  "name": "get_network_status",
  "arguments": { "format": "summary" }
}
```

### Device Management

```typescript
// List all devices with route information
{
  "name": "list_devices",
  "arguments": { "includeRoutes": true }
}

// Set up exit node
{
  "name": "manage_exit_nodes",
  "arguments": {
    "operation": "set",
    "deviceId": "100.71.164.75"
  }
}
```

### Advanced Security

```typescript
// Enable network lock for enhanced security
{
  "name": "manage_network_lock",
  "arguments": { "operation": "enable" }
}

// Configure device posture policy
{
  "name": "manage_device_posture",
  "arguments": {
    "operation": "set_posture_policy",
    "deviceId": "device-123",
    "policy": {
      "requireUpdate": true,
      "allowedOSVersions": ["macOS 14+", "Ubuntu 22.04+"]
    }
  }
}
```

### Network Analytics

```typescript
// Get network statistics
{
  "name": "get_network_stats",
  "arguments": {
    "operation": "get_network_overview",
    "timeRange": "24h"
  }
}
```

## ⚙️ Configuration

### Environment Variables

| Variable            | Description                             | Default   | Required |
| ------------------- | --------------------------------------- | --------- | -------- |
| `TAILSCALE_API_KEY` | Tailscale API key for advanced features | -         | No\*     |
| `TAILSCALE_TAILNET` | Your tailnet name                       | `default` | No       |
| `LOG_LEVEL`         | Logging verbosity (0-3)                 | `1`       | No       |

\*Required for API-based operations like device management and advanced features.

### Script Commands

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Build (dev) and start development server |
| `npm run dev:watch`     | Build with auto-rebuild on file changes  |
| `npm run dev:tsx`       | Run TypeScript directly with tsx         |
| `npm run build`         | Build for production with esbuild        |
| `npm run build:dev`     | Build for development with esbuild       |
| `npm run build:watch`   | Build with watch mode using esbuild      |
| `npm run build:tsc`     | Build with TypeScript compiler           |
| `npm run start`         | Start production server                  |
| `npm run clean`         | Remove build artifacts (cross-platform)  |
| `npm run type-check`    | Type check without building              |
| `npm test`              | Run test suite with Jest                 |
| `npm run test:watch`    | Run tests in watch mode                  |
| `npm run test:coverage` | Run tests with coverage report           |
| `npm run test:ci`       | Run tests for CI/CD environments         |

## 🏗️ Architecture

```
src/
├── index.ts          # 🎯 Main MCP server implementation
├── tailscale-api.ts  # 🌐 REST API client with full feature support
├── tailscale-cli.ts  # 💻 CLI wrapper with error handling
├── tools.ts          # 🛠️ 25+ MCP tool implementations
├── types.ts          # 📝 TypeScript definitions & Zod schemas
└── logger.ts         # 📊 Structured logging system
```

## 🔒 Security Features

- 🔐 **Secure API Key Handling**: Keys never logged or exposed
- 🛡️ **Input Validation**: Comprehensive Zod schema validation
- 🔒 **Network Lock Support**: Enhanced security with key authority
- 👥 **Role-Based Access**: User management with granular permissions
- 📋 **Device Posture**: Compliance policies and enforcement
- 🔍 **Audit Logging**: Comprehensive activity tracking

## 🐛 Troubleshooting

### Common Issues

| Issue                       | Solution                                                |
| --------------------------- | ------------------------------------------------------- |
| Module not found errors     | Ensure `"type": "module"` in package.json               |
| API authentication failures | Verify `TAILSCALE_API_KEY` is valid and has permissions |
| CLI command failures        | Check Tailscale CLI installation: `tailscale status`    |
| Permission errors           | Ensure proper tailnet admin permissions                 |

### Debug Mode

```bash
LOG_LEVEL=0 npm start  # Enable verbose debugging
```

### Health Check

```bash
# Test server startup
timeout 3s npm start

# Verify Tailscale connectivity
tailscale status
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. **Fork the repository** and clone your fork
2. **Install dependencies**: `npm install`
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Make your changes** with proper TypeScript types
5. **Test thoroughly**: Ensure all tools work correctly
6. **Commit with clear messages**: Follow conventional commits
7. **Push and create a Pull Request**

### Contribution Guidelines

- 📝 **Code Style**: Follow existing TypeScript patterns
- 🧪 **Testing**: Add tests for new features
- 📚 **Documentation**: Update README and inline docs
- 🔍 **Type Safety**: Maintain full TypeScript coverage
- 🛡️ **Security**: Follow security best practices
- 📊 **Logging**: Add appropriate logging for debugging

### Areas for Contribution

- 🆕 **New Tools**: Additional Tailscale API integrations
- 🔧 **CLI Enhancements**: Better error handling and features
- 📊 **Monitoring**: Enhanced statistics and analytics
- 🎨 **UI/UX**: Better formatting and user experience
- 📖 **Documentation**: Examples, tutorials, and guides
- 🧪 **Testing**: Unit tests and integration tests

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Tailscale MCP Server Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **[Tailscale](https://tailscale.com/)** - For the amazing mesh VPN platform
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - For the standardized AI tool interface
- **[Anthropic](https://anthropic.com/)** - For Claude and MCP development
- **Open Source Community** - For continuous inspiration and contributions

## 📞 Support

- 📖 **Documentation**: Check this README and inline code comments
- 🐛 **Issues**: Report bugs via GitHub Issues
- 💬 **Discussions**: Join GitHub Discussions for questions
- 🔧 **Development**: See Contributing section above

---

<div align="center">

**Built with ❤️ for the Tailscale and MCP communities**

[⭐ Star this repo](https://github.com/HexSleeve/tailscale-mcp) • [🐛 Report Bug](https://github.com/HexSleeve/tailscale-mcp/issues) • [✨ Request Feature](https://github.com/HexSleeve/tailscale-mcp/issues)

</div>
