# ---------- Stage 1: build the React app ----------
FROM node:25-alpine AS build
WORKDIR /app

# Install dependencies first so this layer is cached until package files change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Stage 2: tiny Nginx image ----------
FROM nginx:1.29-alpine

LABEL org.opencontainers.image.source="https://github.com/Ch-etan/staylite"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ > /dev/null || exit 1