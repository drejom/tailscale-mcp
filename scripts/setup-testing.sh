#!/bin/bash

# Setup Testing Environment for Tailscale MCP Server
# This script helps developers set up their local testing environment

set -e

echo "🧪 Setting up Tailscale MCP Server Testing Environment"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || ! grep -q "tailscale-mcp-server" package.json; then
  print_error "This script must be run from the root of the tailscale-mcp-server project"
  exit 1
fi

print_status "Checking Node.js and Bun..."

# Check Node.js version
if ! command -v bun &>/dev/null; then
  print_error "Bun is not installed. Please install Node.js 18 or later."
  exit 1
fi

print_success "Bun $(bun --version) is installed"

# Check for Bun
if ! command -v bun &>/dev/null; then
  print_warning "Bun is not installed. Installing dependencies with npm as fallback..."
  npm ci
else
  print_success "Bun $(bun --version) is installed"
  # Install dependencies
  print_status "Installing dependencies with Bun..."
  bun install --frozen-lockfile
fi
print_success "Dependencies installed"

# Check for Tailscale CLI
print_status "Checking for Tailscale CLI..."

if command -v tailscale &>/dev/null; then
  TAILSCALE_VERSION=$(tailscale version | head -n1)
  print_success "Tailscale CLI is installed: $TAILSCALE_VERSION"
else
  print_warning "Tailscale CLI is not installed"
  echo ""
  echo "To run integration tests, you need to install Tailscale CLI:"
  echo ""

  # Detect OS and provide installation instructions
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "  # macOS (using Homebrew)"
    echo "  brew install tailscale"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "  # Linux (Ubuntu/Debian)"
    echo "  curl -fsSL https://tailscale.com/install.sh | sh"
    echo ""
    echo "  # Or for other distributions, visit:"
    echo "  # https://tailscale.com/download/linux"
  else
    echo "  # Visit https://tailscale.com/download for installation instructions"
  fi

  echo ""
  read -p "Would you like to continue without Tailscale CLI? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Tailscale CLI is required for integration tests. Exiting."
    exit 1
  fi
fi

# Run unit tests to verify setup
print_status "Running unit tests to verify setup..."
if command -v bun &>/dev/null; then
  if bun run test:unit; then
    print_success "Unit tests passed! ✅"
  else
    print_error "Unit tests failed. Please check your setup."
    exit 1
  fi
else
  if npm run test:unit; then
    print_success "Unit tests passed! ✅"
  else
    print_error "Unit tests failed. Please check your setup."
    exit 1
  fi
fi

# Try integration tests if Tailscale is available
if command -v tailscale &>/dev/null; then
  print_status "Running integration tests..."
  if command -v bun &>/dev/null; then
    if bun run test:integration; then
      print_success "Integration tests passed! ✅"
    else
      print_warning "Integration tests failed. This might be expected if Tailscale is not configured."
      echo "Integration tests require Tailscale CLI to be installed and may require authentication."
    fi
  else
    if npm run test:integration; then
      print_success "Integration tests passed! ✅"
    else
      print_warning "Integration tests failed. This might be expected if Tailscale is not configured."
      echo "Integration tests require Tailscale CLI to be installed and may require authentication."
    fi
  fi
else
  print_warning "Skipping integration tests (Tailscale CLI not available)"
fi

echo ""
print_success "Testing environment setup complete!"
echo ""
echo "Available test commands:"
if command -v bun &>/dev/null; then
  echo "  bun run test:unit          # Run unit tests only"
  echo "  bun run test:integration   # Run integration tests (requires Tailscale CLI)"
  echo "  bun run test              # Run all tests"
  echo "  bun run test:coverage     # Run tests with coverage report"
  echo "  bun run test:watch        # Run tests in watch mode"
  echo ""
  echo "For CI testing:"
  echo "  bun run test:unit:ci       # Unit tests for CI"
  echo "  bun run test:integration:ci # Integration tests for CI"
  echo "  bun run test:ci           # All tests for CI"
else
  echo "  npm run test:unit          # Run unit tests only"
  echo "  npm run test:integration   # Run integration tests (requires Tailscale CLI)"
  echo "  npm run test              # Run all tests"
  echo "  npm run test:coverage     # Run tests with coverage report"
  echo "  npm run test:watch        # Run tests in watch mode"
  echo ""
  echo "For CI testing:"
  echo "  npm run test:unit:ci       # Unit tests for CI"
  echo "  npm run test:integration:ci # Integration tests for CI"
  echo "  npm run test:ci           # All tests for CI"
fi
echo ""

if command -v tailscale &>/dev/null; then
  echo "🎉 Your environment is ready for both unit and integration testing!"
else
  echo "⚠️  Your environment is ready for unit testing only."
  echo "   Install Tailscale CLI to enable integration testing."
fi
