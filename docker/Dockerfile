# Stage 1: Development / Build base
FROM node:22-alpine AS development

WORKDIR /usr/src/app

# Copy workspace configuration and package manifests first
COPY pnpm-workspace.yaml* ./
COPY package.json pnpm-lock.yaml ./

# Copy shared-library sources so workspace links resolve within the build context
COPY ../../api-factory/libs ./api-factory/libs

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Stage 2: Production
FROM node:22-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Add a dedicated non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY pnpm-workspace.yaml* ./
COPY package.json pnpm-lock.yaml ./
COPY ../../api-factory/libs ./api-factory/libs

RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

COPY --from=development /usr/src/app/dist ./dist

# Switch to non-root user before starting the process
USER appuser

EXPOSE 3000

CMD ["node", "dist/main"]
