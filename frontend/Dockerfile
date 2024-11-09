# Dockerfile for frontend

# Build stage
FROM node:16 as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Run TypeScript transpilation with relaxed checks
RUN npx tsc --skipLibCheck --noEmitOnError

# Run Vite build
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
