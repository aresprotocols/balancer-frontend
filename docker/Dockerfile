### STAGE 1: Build ###
# We label our stage as ‘builder’
FROM node:14-alpine as builder

## Build the angular app in production mode and store the artifacts in dist folder
ARG APP_CHAIN_ID=4
ENV VUE_APP_ENV=$APP_CHAIN_ID

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
#RUN apk add --no-cache python2 g++ make git openssh && \
#    mkdir -p ~/.ssh && \
#    ssh-keyscan github.com >> ~/.ssh/known_hosts && \
#    npm ci && mkdir /ng-app && mv ./node_modules ./ng-app

RUN apk add --no-cache python3 git g++ make && \
    git config --global url."https://github.com/".insteadOf "ssh://git@github.com/"

WORKDIR /app

COPY . /app

RUN yarn install && yarn run build
#RUN yarn run build


#### STAGE 2: Setup ###
FROM nginx:1.14.1-alpine

ARG NGINX_CONF=nginx/gui.conf
ENV NGINX_CONF=$NGINX_CONF

## Remove default nginx configs
RUN rm -rf /etc/nginx/conf.d/*

## Copy our default nginx config
#COPY nginx/polkascan.conf /etc/nginx/conf.d/
COPY ${NGINX_CONF} /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
