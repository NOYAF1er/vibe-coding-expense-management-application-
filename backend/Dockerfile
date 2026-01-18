# Backend Dockerfile - Production-ready NestJS API
# Multi-stage build for optimal image size

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Install build dependencies (required for native modules like sqlite3, bcrypt)
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy workspace package files
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy workspace source code
COPY shared/ ./shared/
COPY backend/ ./backend/

# Build shared package first
RUN npm run build -w shared

# Build backend
RUN npm run build -w backend

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install runtime dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy workspace package files
COPY backend/package*.json ./backend/
COPY shared/package*.json ./shared/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/backend/dist ./backend/dist

# Create directory for SQLite database with proper permissions
RUN mkdir -p /app/backend && chmod 777 /app/backend

# Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=10000

# Expose port (will use PORT from environment variable)
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/api/v1/hello', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "run", "start:prod", "-w", "backend"]
