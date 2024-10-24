const request = require("supertest");
const app = require("../bootstrap/app");
const agent = request.agent(app);
const moment = require("moment");
const { faker } = require("@faker-js/faker");
let bookID;

describe("::TestSuite04:: API Books Routes accessed by admin user", () => {
  describe("#Case01:: Create new book", () => {
    it("should return a 201 and new book data", async () => {
      const adminToken = global.adminAccessToken;
      const book = {
        title: faker.lorem.words(3),
        isbn: faker.commerce.isbn(13),
        genre: faker.helpers.arrayElement([
          "Fantasy",
          "History",
          "Comics",
          "Novels",
          "Fiction",
        ]),
        language: faker.helpers.arrayElement(["English", "Hindi", "Punjabi"]),
        author: faker.person.fullName(),
        publisher: faker.company.name(),
        publicationYear: moment(
          faker.date.between({
            from: "2000-01-01T00:00:00Z",
            to: "2024-01-01T00:00:00Z",
          })
        ).year(),
        pages: faker.number.int({ min: 47, max: 321 }),
        copies: faker.number.int({ min: 10, max: 50 }),
      };
      const response = await agent
        .post(global.apiPrefix + "/books")
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(book);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        status: 201,
        message: expect.any(String),
        data: expect.any(Object),
      });
      expect(response.body.data).toHaveProperty("_id");
      global.bookID = response.body.data._id;
    });
  });
  describe("#Case02:: Update book details by book's id", () => {
    it("should return a 200 and book updated data", async () => {
      const token = global.adminAccessToken;
      const book = {
        title: faker.lorem.words(3),
        isbn: faker.commerce.isbn(13),
        genre: faker.helpers.arrayElement([
          "Fantasy",
          "History",
          "Comics",
          "Novels",
          "Fiction",
        ]),
        language: faker.helpers.arrayElement(["English", "Hindi", "Punjabi"]),
        author: faker.person.fullName(),
        publisher: faker.company.name(),
        publicationYear: moment(
          faker.date.between({
            from: "2000-01-01T00:00:00Z",
            to: "2024-01-01T00:00:00Z",
          })
        ).year(),
        pages: faker.number.int({ min: 47, max: 321 }),
        copies: faker.number.int({ min: 10, max: 50 }),
      };
      const response = await agent
        .put(`${global.apiPrefix}/books/${global.bookID}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(book);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 200,
        message: expect.any(String),
        data: expect.any(Object),
      });
      expect(response.body.data).toHaveProperty("_id");
    });
  });

  // describe("#Case03:: Update book status by book's id", () => {
  //   it("should return a 200 and book updated data", async () => {
  //     const token = global.adminAccessToken;
  //     const data = {
  //       status: faker.helpers.arrayElement(["unavailable", "reserved"]),
  //     };

  //     const response = await agent
  //       .patch(`/api/books/${global.bookID}/status`)
  //       .set({ Authorization: `Bearer ${token}` })
  //       .send(data);
  //     expect(response.status).toBe(200);
  //     expect(response.body).toMatchObject({
  //       status: 200,
  //       message: expect.any(String),
  //       data: expect.any(Object),
  //     });
  //     expect(response.body.data.status).toBe(data.status);
  //   });
  // });

  describe("#Case04::Get All books", () => {
    it("should return a 200 and return list of books", async () => {
      const token = global.adminAccessToken;
      const response = await agent
        .get(global.apiPrefix + "/books")
        .set({ Authorization: `Bearer ${token}` });
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 200,
        message: expect.any(String),
        metadata: expect.any(Object),
        books: expect.any(Array),
      });
    });
  });

  describe("#Case05:: Get book details by book's id", () => {
    it("should return a 200 and book data", async () => {
      const token = global.adminAccessToken;

      const response = await agent
        .get(`${global.apiPrefix}/books/${global.bookID}`)
        .set({ Authorization: `Bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        status: 200,
        message: expect.any(String),
        data: expect.any(Object),
      });
      expect(response.body.data.title).toEqual(expect.any(String));
    });
  });

  // describe("#Case06:: Delete book by book's id", () => {
  //   it("should return a 204", async () => {
  //     const adminToken = global.adminAccessToken;

  //     const response = await agent
  //       .delete(`/api/books/${global.bookID}`)
  //       .set({ Authorization: `Bearer ${adminToken}` });

  //     expect(response.status).toBe(204);
  //   });
  // });
});
