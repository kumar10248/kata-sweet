require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("JWT Protected Route", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // Register user
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "secureuser",
        email: "secure@test.com",
        password: "password123",
        fullName: "Secure User"
      });

    // Login user
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "secure@test.com",
        password: "password123"
      });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should block access without JWT", async () => {
    const res = await request(app).get("/api/protected");
    expect(res.statusCode).toBe(401);
  });

  it("should allow access with valid JWT", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Protected content");
  });
});
