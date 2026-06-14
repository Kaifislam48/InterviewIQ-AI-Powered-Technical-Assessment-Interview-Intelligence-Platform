# Step 1: Base build stage
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .

# Step 2: Production execution stage
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
RUN npm ci --only=production

COPY --from=builder --chown=node:node /usr/src/app/src ./src

EXPOSE 5000

ENV NODE_ENV=production

USER node

CMD ["node", "src/server.js"]
