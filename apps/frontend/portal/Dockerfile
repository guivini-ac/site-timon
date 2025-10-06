# syntax=docker/dockerfile:1

FROM node:20-alpine AS base
WORKDIR /workspace
ENV NODE_ENV=production

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json ./
COPY packages/config/package.json packages/config/
COPY packages/sdk/package.json packages/sdk/
COPY packages/types/package.json packages/types/
COPY apps/frontend/portal/package.json apps/frontend/portal/
RUN npm install --workspace @timon/portal --include-workspace-root=false

FROM base AS build
COPY --from=deps /workspace/node_modules ./node_modules
COPY package.json ./
COPY packages ./packages
COPY apps/frontend/portal ./apps/frontend/portal
RUN npm run build --workspace @timon/portal
RUN npm prune --omit=dev

FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /workspace/node_modules ./node_modules
COPY package.json ./
COPY packages ./packages
COPY apps/frontend/portal ./apps/frontend/portal
CMD ["npm", "run", "dev", "--workspace", "@timon/portal"]

FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /workspace/apps/frontend/portal/.next ./.next
COPY --from=build /workspace/apps/frontend/portal/public ./public
COPY --from=build /workspace/apps/frontend/portal/next.config.js ./next.config.js
COPY --from=build /workspace/apps/frontend/portal/package.json ./package.json
COPY --from=build /workspace/apps/frontend/portal/tailwind.config.js ./tailwind.config.js
COPY --from=build /workspace/packages ./packages
COPY --from=build /workspace/node_modules ./node_modules
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
