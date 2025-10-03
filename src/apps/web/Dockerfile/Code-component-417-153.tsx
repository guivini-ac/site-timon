# Multi-stage Dockerfile para Next.js Web App
FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable

# Create app directory
WORKDIR /app

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml* ./
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/web ./apps/web

# Development stage
FROM base AS development
WORKDIR /app/apps/web
EXPOSE 3000
CMD ["pnpm", "dev"]

# Build stage
FROM base AS builder
WORKDIR /app
RUN pnpm --filter web build

# Production stage
FROM node:18-alpine AS production
RUN corepack enable

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]