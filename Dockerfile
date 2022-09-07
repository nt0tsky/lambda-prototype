FROM arm64v8/node:16.13.2-alpine

WORKDIR app

RUN apk  add python3 make g++

COPY . .

RUN apk update && apk add curl
RUN yarn install
