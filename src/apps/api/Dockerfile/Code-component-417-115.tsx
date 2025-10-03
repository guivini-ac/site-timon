# Base stage
FROM node:18-alpine AS base
RUN apk add --no-cache dumb-init
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Development stage
FROM base AS development
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm db:generate
EXPOSE 3000
USER node
CMD ["dumb-init", "pnpm", "start:dev"]

# Build stage
FROM base AS build
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm db:generate
RUN pnpm build
RUN pnpm prune --prod

# Production stage
FROM node:18-alpine AS production
RUN apk add --no-cache dumb-init
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma
USER nestjs
EXPOSE 3000
CMD ["dumb-init", "node", "dist/main.js"]