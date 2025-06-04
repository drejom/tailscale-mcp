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
   