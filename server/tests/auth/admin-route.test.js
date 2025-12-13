require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("Role Based Access - ADMIN", () => {
  let userToken;
  let adminToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // Register normal USER
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "normaluser",
        email: "user@test.com",
        password: "password123",
        fullName: "Normal User"
      });

    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "user@test.com",
        password: "password123"
      });

    userToken = userLogin.body.token;

    // Register ADMIN user
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "adminuser",
        email: "admin@test.com",
        password: "password123",
        fullName: "Admin User",
        role: "ADMIN"
      });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "password123"
      });

    adminToken = adminLogin.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should block USER from accessing admin route", async () => {
    const res = await request(app)
      .get("/api/admin")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("should allow ADMIN to access admin route", async () => {
    const res = await request(app)
      .get("/api/admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Admin content");
  });
});
