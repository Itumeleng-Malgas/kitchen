# ---------- build ----------
FROM node:20-alpine AS builder

WORKDIR /app

ARG ENV=prod
ENV ENV=${ENV}

COPY food-dashboard/package.json food-dashboard/package-lock.json ./
RUN npm install

COPY food-dashboard .

RUN if [ "$ENV" = "prod" ]; then npm run build; fi

# ---------- runtime ----------
FROM nginx:1.25

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
