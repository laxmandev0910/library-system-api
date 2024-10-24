const request = require("supertest");
const app = require("../bootstrap/app");
const agent = request.agent(app);
const { faker } = require("@faker-js/faker");
let bookID;

describe("::TestSuite03:: API JWT token related test cases", () => {
  describe("#Case01:: No Authorization header provided", () => {
    it("should return a 400", async () => {
      const response = await agent.get(global.apiPrefix + "/books");
      expect(response.status).toBe(400);
    });
  });
  describe("#Case02:: Invalid API Access Token provided", () => {
    it("should return a 401", async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NzA5MTViMzQzMjcyYjU0ZGU3ZjU3NjAiLCJ1c2VybmFtZSI6ImdhdXRhbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcyOTE5MTk2OCwiZXhwIjoxNzI5MTk1NTY4fQ.EZjSKRK-lLGPpWhScMwGG_jQl7CAqKNRyltoOlcxd7w";
      const response = await agent
        .get(global.apiPrefix + "/books")
        .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(401);
    });
  });

  describe("#Case03:: When user tries to accerss ADMIN protected route", () => {
    it("should return a 403", async () => {
      const token = global.userAccessToken;
      const response = await agent
        .delete(global.apiPrefix + "/books/dsfsdfsdf")
        .set({ Authorization: `Bearer ${token}` })
        .send(user);
      expect(response.status).toBe(403);
    });
  });
});
