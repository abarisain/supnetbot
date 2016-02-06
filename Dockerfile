FROM node

ENV TWITTER_KEY ""
ENV TWITTER_SECRET ""

ENV DISCORD_LOGIN ""
ENV DISCORD_PASSWORD ""
ENV DISCORD_CHANNEL ""

ENV IRC_SERVER ""
ENV IRC_CHANNEL ""
ENV IRC_NICKNAME ""

COPY . /data/supnetbot

WORKDIR /data/supnetbot

RUN npm install -g forever &&\
    npm install

CMD npm start
