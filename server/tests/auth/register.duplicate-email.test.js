require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("User Registration - Duplicate Email", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should not allow registering with an existing email", async () => {
    const userData = {
      username: "user1",
      email: "duplicate@test.com",
      password: "password123",
      fullName: "Duplicate User"
    };

    // First registration (should succeed)
    await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    // Second registration with same email (should fail)
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        ...userData,
        username: "user2"
      });

    expect(response.statusCode).toBe(409);
  });
});
