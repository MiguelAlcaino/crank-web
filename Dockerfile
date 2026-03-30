# Multi-stage build for Vue.js application

# Stage 1: Build the application
FROM node:18-alpine AS builder

ARG VITE_CRANK_REST_SERVER_URL
ARG VITE_CRANK_GRAPHQL_SERVER_URL
ARG VITE_CRANK_PAYMENTS_URL

# Convert ARGs to ENV variables so Vite can access them during build
ENV VITE_CRANK_REST_SERVER_URL=${VITE_CRANK_REST_SERVER_URL}
ENV VITE_CRANK_GRAPHQL_SERVER_URL=${VITE_CRANK_GRAPHQL_SERVER_URL}
ENV VITE_CRANK_PAYMENTS_URL=${VITE_CRANK_PAYMENTS_URL}

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy custom nginx config (optional, will use default if not provided)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Start nginx via entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
