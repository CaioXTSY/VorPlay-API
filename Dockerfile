# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

# clean install
COPY package*.json ./
RUN npm ci

# copying the rest
COPY . .

COPY .env .env

RUN npx prisma generate

RUN npm run build

# Stage 2: prod
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY .env .env

# copying only prisma client from builder modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/prisma ./prisma

CMD ["node", "dist/main"]
