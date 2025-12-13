require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../../app");

describe("User Login", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should login user and return JWT token", async () => {
    const userData = {
      username: "loginuser",
      email: "login@test.com",
      password: "password123",
      fullName: "Login User"
    };

    // Register user first
    await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    // Login
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: userData.password
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();

    // Verify token
    const decoded = jwt.verify(
      response.body.token,
      process.env.JWT_SECRET
    );

    expect(decoded.email).toBe(userData.email);
  });
});
