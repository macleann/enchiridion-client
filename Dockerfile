# Build stage
FROM node:alpine as build
WORKDIR /app
COPY the-enchiridion/package*.json ./

ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_CLIENT_ID

ENV REACT_APP_API_URL $REACT_APP_API_URL
ENV REACT_APP_GOOGLE_CLIENT_ID $REACT_APP_GOOGLE_CLIENT_ID

RUN npm ci
COPY the-enchiridion/ ./
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
