### STAGE 1: Build ###
# We label our stage as ‘builder’
FROM node:14-alpine as builder

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN apk add --no-cache python2 g++ make && \
    npm ci && mkdir /ng-app && mv ./node_modules ./ng-app

WORKDIR /ng-app

COPY . /ng-app/

## Build the angular app in production mode and store the artifacts in dist folder
ARG VUE_APP_ENV=local
ENV VUE_APP_ENV=$VUE_APP_ENV

ARG VUE_APP_NETWORK=local
ENV VUE_APP_NETWORK=$VUE_APP_NETWORK

ARG VUE_APP_IPFS_NODE=localhost:5001
ENV VUE_APP_IPFS_NODE=$VUE_APP_IPFS_NODE

RUN npm run build

### STAGE 2: Setup ###
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
COPY --from=builder /ng-app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
