FROM nginx:1.23.1-alpine

COPY nginx/nginx.conf /etc/nginx/

WORKDIR /var/www
COPY dist/ ./

EXPOSE 80
