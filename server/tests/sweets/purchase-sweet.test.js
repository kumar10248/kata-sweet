require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("Purchase Sweet", () => {
  let token;
  let sweetId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // register + login
    await request(app).post("/api/auth/register").send({
      username: "buyer",
      email: "buyer@test.com",
      password: "password123",
      fullName: "Sweet Buyer"
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "buyer@test.com",
        password: "password123"
      });

    token = loginRes.body.token;

    // create sweet
    const sweetRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Jalebi",
        category: "Indian",
        price: 15,
        quantity: 5
      });

    sweetId = sweetRes.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should decrease sweet quantity on purchase", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(4);
  });
});
