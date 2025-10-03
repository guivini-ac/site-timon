# Multi-stage Dockerfile para API NestJS
FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable

# Create app directory
WORKDIR /app

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/api ./apps/api

# Development stage
FROM base AS development
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["pnpm", "start:dev"]

# Build stage
FROM base AS builder
WORKDIR /app
RUN pnpm --filter api build

# Production stage
FROM node:18-alpine AS production
RUN corepack enable

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 3000
USER node

CMD ["node", "dist/main.js"]