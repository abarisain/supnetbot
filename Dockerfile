FROM node

COPY . /opt/supnetbot

WORKDIR /opt/supnetbot

RUN npm install

CMD node /opt/supnetbot/bin/supnetbot.js
