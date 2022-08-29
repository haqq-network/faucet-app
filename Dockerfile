##################################################
# Build app
##################################################

FROM node:16.17.0-alpine3.15 AS builder

WORKDIR /usr/faucet-app

COPY .yarn ./.yarn
COPY .yarnrc.yml yarn.lock package.json ./
RUN yarn install --immutable

COPY src ./src
COPY public ./public
COPY tailwind.config.js tsconfig.json .babelrc .postcssrc .browserslistrc ./
RUN yarn build

##################################################
# Final Image
##################################################

FROM nginx:1.23.1-alpine

WORKDIR /var/www

COPY --from=builder dist/ ./
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
