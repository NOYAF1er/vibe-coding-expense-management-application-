# Frontend Dockerfile - Production-ready React SPA
# Multi-stage build for optimal image size

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy workspace package files
COPY frontend/package*.json ./frontend/
COPY shared/package*.json ./shared/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy workspace source code
COPY shared/ ./shared/
COPY frontend/ ./frontend/

# Build shared package first
RUN npm run build -w shared

# Build frontend
RUN npm run build -w frontend

# Stage 2: Production stage with static server
FROM node:20-alpine AS production

# Install serve package globally to serve static files
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built static files from builder stage
COPY --from=builder /app/frontend/dist ./dist

# Expose port 3000 (serve default)
ENV PORT=3000
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT} || exit 1

# Serve the static files with SPA fallback
# -s flag enables single-page application mode (fallback to index.html)
# -l flag sets the port
CMD serve -s dist -l ${PORT}
