# Build stage
FROM node:latest as build
WORKDIR /app
COPY the-enchiridion/package*.json ./
RUN npm install
COPY the-enchiridion/ ./
RUN npm run build

# Production stage
FROM nginx:latest
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]