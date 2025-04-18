# Build stage
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_SERVER_URL

ENV VITE_SERVER_URL=$VITE_SERVER_URL

RUN npm run build

# Production stage
FROM caddy:2
COPY --from=builder /app/dist /srv
