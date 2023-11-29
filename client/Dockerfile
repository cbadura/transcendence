# ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
# build the front-end
# ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
FROM node:16 AS frontend_build

ARG HOST_NAME
ARG NG_APP_HOST_NAME=$HOST_NAME

WORKDIR app/
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
# set up correct nginx configs
# ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
FROM alpine:latest AS nginx_config

ARG HOST_NAME

RUN apk add openssl
RUN openssl req -x509 -newkey rsa:4096 -keyout /transcendence.key \
    -out /transcendence.crt -sha256 -days 3650 -nodes \
    -subj "/C=DE/ST=Berlin/L=Berlin/O=42Berlin/OU=Circle06/CN=$HOST_NAME"

COPY nginx.conf /nginx.conf
RUN /bin/sed -i -e "s/\$HOST_NAME/$HOST_NAME/g" nginx.conf

# ~ ~ ~ ~ ~ ~
# run nginx
# ~ ~ ~ ~ ~ ~
FROM nginx:latest

RUN rm -rf /var/www
COPY --from=nginx_config /nginx.conf /etc/nginx/nginx.conf
COPY --from=nginx_config /transcendence.key /etc/ssl/nginx.key
COPY --from=nginx_config /transcendence.crt /etc/ssl/nginx.crt
COPY --from=frontend_build /app/dist/transcendence/ /var/www/

