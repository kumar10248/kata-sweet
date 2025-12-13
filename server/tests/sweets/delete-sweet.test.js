require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("Delete Sweet (ADMIN only)", () => {
  let userToken;
  let adminToken;
  let sweetId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // USER
    await request(app).post("/api/auth/register").send({
      username: "userdel",
      email: "userdel@test.com",
      password: "password123",
      fullName: "User Delete"
    });

    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "userdel@test.com",
        password: "password123"
      });

    userToken = userLogin.body.token;

    // ADMIN
    await request(app).post("/api/auth/register").send({
      username: "admindel",
      email: "admindel@test.com",
      password: "password123",
      fullName: "Admin Delete",
      role: "ADMIN"
    });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admindel@test.com",
        password: "password123"
      });

    adminToken = adminLogin.body.token;

    // Create sweet as ADMIN
    const sweetRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Peda",
        category: "Indian",
        price: 25,
        quantity: 20
      });

    sweetId = sweetRes.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should block USER from deleting sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("should allow ADMIN to delete sweet", async () => {
    const res = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});
