
# Build

FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files first
# This allows Docker to cache npm install
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# Copy Prisma files
COPY prisma ./prisma
COPY prisma.config.ts ./

# Copy source and TypeScript configuration
COPY src ./src
COPY tsconfig.json ./

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build


# Production

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy dependency files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy Prisma files
COPY prisma ./prisma
COPY prisma.config.ts ./

# Copy generated Prisma Client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Application port
EXPOSE 5000

# Start application
CMD ["node", "dist/server.js"]