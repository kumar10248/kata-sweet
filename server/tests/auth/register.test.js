require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("POST /api/auth/register", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should register a user and return 201", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "kumar",
        email: "kumar@test.com",
        password: "123456",
        fullName: "Kumar Devashish"
      });

    expect(response.statusCode).toBe(201);
  });
});
