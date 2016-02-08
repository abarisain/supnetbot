FROM node

COPY . /data/supnetbot

WORKDIR /data/supnetbot

RUN npm install

CMD node /data/supnetbot/server.js
