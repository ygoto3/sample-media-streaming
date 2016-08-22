FROM gliderlabs/alpine:3.3

RUN apk add --update nginx && rm -rf /var/cache/apk/*

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY build /var/www/visual

WORKDIR /etc/nginx

CMD ["nginx"]

EXPOSE 80
