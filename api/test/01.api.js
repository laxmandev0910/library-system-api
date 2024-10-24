const request = require("supertest");
const app = require("../bootstrap/app");
const agent = request.agent(app);

describe("::TestSuite01:: API Guest Routes", () => {
  describe(":#Case-01:: Welcome route", () => {
    it("should return a 200", (done) => {
      agent
        .get(global.apiPrefix)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
  describe("#Case-02:: API 404 route test", () => {
    it("should return a 404", (done) => {
      agent
        .get(global.apiPrefix + "/test")
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
});
