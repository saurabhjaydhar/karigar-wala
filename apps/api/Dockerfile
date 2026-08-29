# Build from the monorepo root: docker build -f apps/api/Dockerfile -t karigar-wala-api .
FROM node:22-alpine AS build
WORKDIR /repo

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm ci

COPY packages/shared packages/shared
COPY apps/api apps/api

# packages/shared must be compiled before apps/api — its package.json "main"
# points at compiled JS, not the raw TS source (Node can't require() .ts).
RUN npm run build -w packages/shared
RUN npm run build -w apps/api

FROM node:22-alpine AS runtime
WORKDIR /repo
ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm ci --omit=dev

COPY --from=build /repo/packages/shared/dist packages/shared/dist
COPY --from=build /repo/apps/api/dist apps/api/dist

EXPOSE 4000
CMD ["node", "apps/api/dist/server.js"]
