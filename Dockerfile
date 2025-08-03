#
# ---- Builder Stage ----
# This stage installs dependencies (including devDependencies)
# and builds the application source code.
#
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies for the build
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Run the build script to transpile TypeScript to JavaScript
RUN bun run build

# Remove dev dependencies
RUN bun install --production --frozen-lockfile

#
# ---- Production Stage ----
# This stage creates the final, lean image by copying only the
# necessary artifacts from the builder stage.
#
FROM node:20-alpine AS production

# Install dumb-init and dependencies for Tailscale
RUN apk add --no-cache dumb-init ca-certificates iptables ip6tables

# Copy Tailscale binaries from the official Docker image
COPY --from=docker.io/tailscale/tailscale:stable /usr/local/bin/tailscaled /usr/local/bin/tailscaled
COPY --from=docker.io/tailscale/tailscale:stable /usr/local/bin/tailscale /usr/local/bin/tailscale

# Create necessary directories for Tailscale
RUN mkdir -p /var/run/tailscale /var/cache/tailscale /var/lib/tailscale

WORKDIR /app

# Copy production dependencies from the builder stage. This is faster
# and more reliable than re-installing them.
COPY --from=builder /app/node_modules ./node_modules

# Copy the compiled application code from the builder stage
COPY --from=builder /app/dist ./dist

# Copy other project files like README and LICENSE
COPY --from=builder /app/README.md ./
COPY --from=builder /app/LICENSE ./

# Copy the startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Expose the port the application will run on
EXPOSE 3000

# A basic health check to ensure the Node.js process can start.
# For a real-world app, this should hit a dedicated /health endpoint.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "process.exit(0)" || exit 1

# Set environment variables for the production environment
ENV NODE_ENV=production
ENV LOG_LEVEL=1

# Use dumb-init as the entrypoint to manage the node process
ENTRYPOINT ["dumb-init", "--"]

# The command to start the application with Tailscale
CMD ["./start.sh"]
