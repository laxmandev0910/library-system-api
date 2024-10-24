const { APP_PORT, MONGO_DB, API } = require("../config/api.config");
const mongoose = require("mongoose");
const http = require("http");
const app = require("../bootstrap/app");
const server = http.createServer(app);
const Database = require("../bootstrap/database");
const { exec } = require("child_process");

beforeAll((done) => {
  try {
    global.apiPrefix = API.PREFIX;
    server.listen(APP_PORT);
    mongoose.connect(Database.getConnectionString(), {
      dbName: MONGO_DB.NAME,
    });
    exec("npm run seed:test", (error, stdout, stderr) => {
      if (error) {
        return done(error);
      } else {
        done();
      }
    });
  } catch (error) {
    return done(error);
  }
});

afterAll((done) => {
  try {
    server.close();
    mongoose.connection.close();
    done();
  } catch (error) {
    return done(error);
  }
});
