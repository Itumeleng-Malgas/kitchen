# Stage 1: Build frontend
FROM node:20-alpine AS builder

WORKDIR /app
COPY food-dashboard/package.json food-dashboard/package-lock.json ./
RUN npm install

COPY food-dashboard ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25

# Copy custom nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]