FROM node:20-alpine AS builder

WORKDIR /app
COPY food-dashboard/package.json food-dashboard/package-lock.json ./
RUN npm install

COPY food-dashboard .
RUN npm run build

FROM nginx:1.25

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy wait-for-it.sh
COPY ./wait-for-it.sh ./wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Start Nginx only after backend is ready
CMD ["/wait-for-it.sh", "backend:8000", "--", "nginx", "-g", "daemon off;"]
