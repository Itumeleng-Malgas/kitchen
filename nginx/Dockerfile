FROM node:20-alpine AS builder

WORKDIR /app
COPY food-dashboard/package.json food-dashboard/package-lock.json ./
RUN npm install

COPY food-dashboard .
RUN npm run build


FROM nginx:1.25
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
