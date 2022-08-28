FROM nginx:1.23.1-alpine

WORKDIR /var/www

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist .

EXPOSE 80
