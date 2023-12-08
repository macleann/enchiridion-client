# Build stage
FROM node:alpine as build
WORKDIR /app
COPY the-enchiridion/package*.json ./

ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_CLIENT_ID

ENV REACT_APP_API_URL=https://api.enchiridion.tv
ENV REACT_APP_GOOGLE_CLIENT_ID=115078931939-eoj0gcm7iail2dfu94b02nsuh9gffm7o.apps.googleusercontent.com

RUN npm ci
COPY the-enchiridion/ ./
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]