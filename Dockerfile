FROM node

COPY . /data/supnetbot

WORKDIR /data/supnetbot

RUN npm install -g forever &&\
    npm install

CMD forever node ./server.js
