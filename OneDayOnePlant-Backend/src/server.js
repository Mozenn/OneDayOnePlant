const app = require("./app");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  MONGO_DB,
  PORT
} = process.env;

app.listen(process.env.PORT);
logger.info(`Server listening on port ${PORT}`);

const url = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${MONGO_DB}`

mongoose
  .set("useUnifiedTopology", true)
  .connect(url, { useNewUrlParser: true })
  .catch((err) => {
    logger.error(err);
  });
