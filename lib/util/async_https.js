// @ts-check
const nodeHttps = require("https");

// Wrapper enabling the use of promises with node's http lib
// Only supports JSON
const https = {
  get: (host, path, options) => {
    return new Promise((resolve, reject) => {
      const nodeOpts = Object.assign(
        {
          protocol: "https:",
          hostname: host,
          path,
          headers: {
            "User-Agent": "Sammy/1.0"
          }
        },
        options
      );

      let url = "https://" + host + path;

      let req = nodeHttps.get(nodeOpts, res => {
        const { statusCode } = res;
        const contentType = res.headers["content-type"];

        let err;
        if (statusCode != 200) {
          err = `HTTP Get failure (${url}): Status Code: ${statusCode}`;
        } else if (!/^application\/json/.test(contentType)) {
          err = `HTTP Get failure (${url}): Invalid content-type: ${contentType}`;
        }

        if (err) {
          res.resume(); // Apparently this frees up memory
          reject(err);
        }

        res.setEncoding("utf8");
        let data = "";
        res.on("data", chunk => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(`HTTP Get failure (${url}): Could not parse JSON response`);
          }
        });
      });

      req.on("error", e => {
        reject("Internal error: ${e}");
      });
    });
  }
};

module.exports = https;
