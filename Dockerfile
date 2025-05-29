# Stage 1: Build app
FROM node:22-alpine AS builder
WORKDIR /app

# Copy và cài dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn và build
COPY . .
RUN npm run build

# Stage 2: Runtime chỉ dùng output đã build
FROM node:22-alpine AS runtime
WORKDIR /app

# Cài production dependencies để tránh lỗi native như bcrypt
COPY package*.json ./
RUN npm install --omit=dev

# Copy dist đã build, env, firebase key
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/keys/firebase-admin-key.json ./src/keys/firebase-admin-key.json
COPY --from=builder /app/.env.production ./.env

EXPOSE 3000
CMD ["node", "dist/main"]