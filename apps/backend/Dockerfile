# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /workspace
ENV NODE_ENV=production

FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json ./
COPY packages/config/package.json packages/config/
COPY packages/types/package.json packages/types/
COPY apps/backend/package.json apps/backend/
RUN npm install --workspace @timon/backend --include-workspace-root=false

FROM base AS build
COPY --from=deps /workspace/node_modules ./node_modules
COPY package.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend
RUN npm run build --workspace @timon/backend

FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /workspace/node_modules ./node_modules
COPY package.json ./
COPY packages ./packages
COPY apps/backend ./apps/backend
CMD ["npm", "run", "start:dev", "--workspace", "@timon/backend"]

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=build /workspace/apps/backend/dist ./dist
COPY apps/backend/package.json ./package.json
COPY apps/backend/prisma ./prisma
CMD ["node", "dist/main.js"]
