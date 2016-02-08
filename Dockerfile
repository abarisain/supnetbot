FROM node

COPY . /opt/supnetbot

WORKDIR /opt/supnetbot

RUN npm install

CMD node /opt/supnetbot/server.js
