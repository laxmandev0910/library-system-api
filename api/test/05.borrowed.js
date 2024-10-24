const request = require("supertest");
const app = require("../bootstrap/app");
const agent = request.agent(app);
const moment = require("moment");
const { faker } = require("@faker-js/faker");
let borrowedID;

describe("::TestSuite05:: API Borrowed Books module related routes", () => {
  describe("#Case01:: Borrow a book by user", () => {
    it("should return a 201 and new borrowed book details", async () => {
      const token = global.userAccessToken;
      const data = {
        dueAt: moment().add(3, "days"),
      };
      const response = await agent
        .post(`${global.apiPrefix}/books/${global.bookID}/borrow`)
        .set({ Authorization: `Bearer ${token}` })
        .send(data);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        status: 201,
        message: expect.any(String),
        data: expect.any(Object),
      });
      expect(response.body.data).toHaveProperty("_id");
      global.borrowedID = response.body.data._id;
    });
  });
  describe("#Case02:: Return a borrowed book by user", () => {
    it("should return a 200 and updated borrowed book with returned status", async () => {
      const token = global.userAccessToken;
      const response = await agent
        .patch(`${global.apiPrefix}/books/${global.bookID}/return`)
        .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 200,
        message: expect.any(String),
        data: expect.any(Object),
      });
      expect(response.body.data).toHaveProperty("_id");
    });
  });

  describe("#Case03:: Get all borrowed book by user at any time", () => {
    it("should return a 200 and list of  borrowed book", async () => {
      const token = global.userAccessToken;
      const response = await agent
        .get(`${global.apiPrefix}/borrowed-books`)
        .set({ Authorization: `Bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 200,
        message: expect.any(String),
        metadata: expect.any(Object),
        borrowedbooks: expect.any(Object),
      });
    });
  });
});
