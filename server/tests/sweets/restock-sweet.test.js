require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("Restock Sweet (ADMIN only)", () => {
  let userToken;
  let adminToken;
  let sweetId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // USER
    await request(app).post("/api/auth/register").send({
      username: "restockuser",
      email: "restockuser@test.com",
      password: "password123",
      fullName: "Restock User"
    });

    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "restockuser@test.com",
        password: "password123"
      });

    userToken = userLogin.body.token;

    // ADMIN
    await request(app).post("/api/auth/register").send({
      username: "restockadmin",
      email: "restockadmin@test.com",
      password: "password123",
      fullName: "Restock Admin",
      role: "ADMIN"
    });

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "restockadmin@test.com",
        password: "password123"
      });

    adminToken = adminLogin.body.token;

    // Create sweet as ADMIN
    const sweetRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Kaju Katli",
        category: "Indian",
        price: 50,
        quantity: 10
      });

    sweetId = sweetRes.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should block USER from restocking sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  it("should allow ADMIN to restock sweet", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(11);
  });
});
