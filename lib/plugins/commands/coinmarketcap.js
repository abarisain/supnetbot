// @ts-check
"use strict";

const AbstractCommandPlugin = require("./abstract_command_plugin");
const MessagesHandler = require("../../messages_handler");
const { RichMessage, RichMessageField } = require("../../rich_message");
const https = require("../../util/async_https");
const logger = require("winston");

async function fetchTickers() {
  logger.debug("[Coinmarketcap] Fetching from API");
  const res = await https.get("api.coinmarketcap.com", `/v1/ticker/?limit=0`);
  if (!Array.isArray(res)) {
    throw new Error("Result was not an array");
  }
  return res.map(val => {
    return new Coin(val.symbol, val["price_usd"], val["percent_change_24h"]);
  });
}

class Coin {
  constructor(name, usdValue, percent24h) {
    /** @type {string} */
    this.name = name.toUpperCase();
    /** @type {string} */
    this.usdValue = usdValue;
    /** @type {string} */
    this.percent24h = percent24h;
  }

  toRichMessageField() {
    return new RichMessageField(
      this.name.toUpperCase(),
      `$ ${this.usdValue}\n24h: ${this.percent24h} %`,
      true
    );
  }

  toBasicString() {
    return `${this.name.toUpperCase()}: $ ${this.usdValue} - 24h: ${
      this.percent24h
    } %`;
  }
}

class Coinmarketcap extends AbstractCommandPlugin {
  constructor(options) {
    super(options);
  }

  get name() {
    return "coinmarketcap";
  }

  get alias() {
    return "cm";
  }

  onCommand(backend, args) {
    let coins;
    if (args && args.trim) {
      const trimmedArgs = args.trim();
      if (trimmedArgs != "") {
        coins = args
          .split(" ")
          .filter(a => {
            return a.trim() != "";
          })
          .map(a => a.toUpperCase());
      }
    }

    if (!coins || coins.length == 0) {
      coins = ["ETH", "BTC", "XRP", "MIOTA"];
    }

    logger.debug("[Coinmarketcap] Fetching " + coins.toString());
    fetchTickers()
      .then(res => {
        logger.debug("[Coinmarketcap] Got them");

        res = res.filter(r => {
          return coins.indexOf(r.name) != -1;
        });

        if (res.length == 0) {
          MessagesHandler.sendMessageExcluding(
            [],
            "Could not find coins for query '" + coins.toString() + "'"
          );
          return;
        }

        const message = new RichMessage(null);

        message.basicText = res.reduce((acc, coin, i) => {
          return acc + "\n" + coin.toBasicString();
        }, "Coinmarketcap Tickers:");

        message.addEmbed = true;
        message.content = null;
        message.color = "f0ad4e";
        message.footer = "Coinmarketcap Tickers";
        message.fields = res.map(c => {
          return c.toRichMessageField();
        });

        MessagesHandler.sendMessageExcluding([], message);
      })
      .catch(e => {
        MessagesHandler.sendMessageExcluding(
          [],
          "Error while fetching Coinmarketcap tickers: " + e
        );
      });
  }
}

module.exports = Coinmarketcap;
