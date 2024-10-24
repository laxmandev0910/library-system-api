const request = require("supertest");
const app = require("../bootstrap/app");
const agent = request.agent(app);
const { faker } = require("@faker-js/faker");

describe("::TestSuite02:: API Auth Routes", () => {
  describe("#Case01::Validate new user's data while signup", () => {
    it("should return a 422", async () => {
      const user = {
        name: faker.person.fullName(),
      };
      const response = await agent
        .post(global.apiPrefix + "/auth/panel/signup")
        .send(user);
      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({
        status: 422,
        message: expect.any(String),
        errors: expect.any(Object),
      });
    });
  });

  describe("#Case02:: Signup new admin user", () => {
    it("should return a 201 and new user with role:Admin", async () => {
      const slug = faker.internet.userName().toLowerCase();
      const user = {
        name: faker.person.fullName(),
        username: slug,
        email: `${slug}@example.lab`,
        password: `${slug}@0910#`,
      };
      const response = await agent
        .post(global.apiPrefix + "/auth/panel/signup")
        .send(user);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        status: 201,
        message: expect.any(String),
        data: expect.any(Object),
      });
      expect(response.body.data.role).toBe("ADMIN");
      global.admin = {
        id: response.body.data._id,
        username: response.body.data.username,
        email: response.body.data.email,
        role: response.body.data.role,
      };
    });
  });

  describe("#Case03:: Signup new user", () => {
    it("should return a 201 and new user with role:USER", async () => {
      const slug = faker.internet.userName().toLowerCase();
      const user = {
        name: faker.person.fullName(),
        username: slug,
        email: `${slug}@example.lab`,
        password: `${slug}@0910#`,
      };
      const response = await agent
        .post(global.apiPrefix + "/auth/signup")
        .send(user);
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        status: 201,
        message: expect.any(String),
        data: expect.any(Object),
      });
      expect(response.body.data.role).toBe("USER");
      global.user = {
        id: response.body.data._id,
        username: response.body.data.username,
        email: response.body.data.email,
        role: response.body.data.role,
      };
    });
  });

  describe("#Case04:: SignIn to user account with wrong credentials ", () => {
    it("should return a 401", async () => {
      const slug = faker.internet.userName();
      const user = {
        username: slug,
        password: `${slug}@0910#`,
      };

      const response = await agent
        .post(global.apiPrefix + "/auth/signin")
        .send(user);
      expect(response.status).toBe(401);
    });
  });

  describe("#Case05:: SignIn to account with right credentials by user with role:USER ", () => {
    it("should return a 200 with auth generated tokens", async () => {
      const user = global.user;
      const data = {
        username: user.username,
        password: `${user.username}@0910#`,
      };
      const response = await agent
        .post(global.apiPrefix + "/auth/signin")
        .send(data);
      expect(response.body).toMatchObject({
        status: 200,
        message: expect.any(String),
        data: expect.any(Object),
      });
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      global.userAccessToken = response.body.data.accessToken;
    });
  });

  describe("#Case05:: SignIn to account with right credentials by user with role:Admin ", () => {
    it("should return a 200 with auth generated tokens", async () => {
      const user = global.admin;
      const data = {
        username: user.username,
        password: `${user.username}@0910#`,
      };
      const response = await agent
        .post(global.apiPrefix + "/auth/signin")
        .send(data);
      expect(response.body).toMatchObject({
        status: 200,
        message: expect.any(String),
        data: expect.any(Object),
      });
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data).toHaveProperty("refreshToken");
      global.adminAccessToken = response.body.data.accessToken;
    });
  });
});
