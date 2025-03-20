# Stage 1: Build the application
FROM node:18 AS builder

WORKDIR /usr/src/app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the entire codebase and build the project
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:18-slim

WORKDIR /usr/src/app

# Copy package.json files
COPY --from=builder /usr/src/app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built source code from builder
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port (configured via env)
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
