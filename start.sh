#!/bin/sh

# Check if we're using API key approach or daemon approach
if [ -n "$TAILSCALE_API_KEY" ]; then
    echo "Using Tailscale API key for REST API calls (daemon not required)"
    echo "TAILSCALE_API_KEY detected - MCP server will use REST API"
    echo "TAILSCALE_TAILNET: ${TAILSCALE_TAILNET:-not-set}"
else
    # Start tailscaled daemon in the background as root
    echo "Starting tailscaled daemon for CLI access..."
    tailscaled --state-dir=/var/lib/tailscale --socket=/var/run/tailscale/tailscaled.sock &
    
    # Wait a moment for tailscaled to start
    sleep 2
    
    # Check if we have an auth key to authenticate
    if [ -n "$TAILSCALE_AUTHKEY" ]; then
        echo "Authenticating with Tailscale..."
        tailscale up --authkey="$TAILSCALE_AUTHKEY" --hostname="${TAILSCALE_HOSTNAME:-tailscale-mcp}"
    else
        echo "No TAILSCALE_AUTHKEY provided. Manual authentication required."
        echo "Run: docker exec -it <container> tailscale up"
    fi
fi

# Start the main application
echo "Starting MCP server..."
exec node dist/index.js