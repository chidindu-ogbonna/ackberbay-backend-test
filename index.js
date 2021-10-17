/* global require process */
const http = require("http");
const app = require("./app");
const { logger } = require("./utils");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
