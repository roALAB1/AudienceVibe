# Multi-stage build for production
# Stage 1: Builder
FROM node:22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++ bash

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files first (for layer caching)
COPY package.json pnpm-lock.yaml ./

# Copy patches directory (required for pnpm install)
COPY patches ./patches

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy all configuration files
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY drizzle.config.ts ./
COPY vitest.config.ts ./
COPY components.json ./
COPY vercel.json ./
COPY build.sh ./
COPY scripts ./scripts

# Copy source code
COPY client ./client
COPY shared ./shared  
COPY server ./server
COPY drizzle ./drizzle

# Run build with validation
ENV NODE_ENV=production
RUN pnpm run build

# Verify critical build outputs exist
RUN test -f dist/public/index.html || (echo "ERROR: dist/public/index.html not found" && exit 1)
RUN test -f dist/index.js || (echo "ERROR: dist/index.js not found" && exit 1)
RUN ls -lh dist/ && ls -lh dist/public/

# Stage 2: Production Runtime
FROM node:22-alpine

# Install runtime dependencies
RUN apk add --no-cache bash wget

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Copy patches directory (needed for production install)
COPY --from=builder /app/patches ./patches

# Install ONLY production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy runtime source code (server and shared needed at runtime)
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/drizzle ./drizzle

# Verify files are present in production image
RUN ls -lh dist/ && ls -lh dist/public/ && test -f dist/index.js

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:3000/ || exit 1

# Start server
CMD ["node", "dist/index.js"]
