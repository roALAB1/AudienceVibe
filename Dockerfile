# Multi-stage build for production
FROM node:22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy patches directory (required for pnpm install)
COPY patches ./patches

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all configuration files
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY drizzle.config.ts ./
COPY vitest.config.ts ./
COPY components.json ./
COPY vercel.json ./

# Copy source code
COPY client ./client
COPY shared ./shared  
COPY server ./server
COPY drizzle ./drizzle

# Build application
ENV NODE_ENV=production
RUN pnpm run build

# Verify build succeeded
RUN test -f dist/public/index.html || (echo "ERROR: Build failed - index.html not found" && exit 1)
RUN test -f dist/index.js || (echo "ERROR: Build failed - index.js not found" && exit 1)

# Production stage
FROM node:22-alpine

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Copy patches directory (needed for production install)
COPY --from=builder /app/patches ./patches

# Copy server and shared code (needed at runtime)
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:3000/ || exit 1

# Start server
CMD ["node", "dist/index.js"]
