FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./

# Install dependencies with npm ci for production
RUN npm ci --only=production

COPY . .

# Explicitly set HOST to 0.0.0.0 to bind to all interfaces
ENV HOST=0.0.0.0

# Use node directly instead of nodemon in production
CMD ["node", "src/index.js"]