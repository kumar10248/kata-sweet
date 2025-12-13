require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("Update Sweet", () => {
  let token;
  let sweetId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // register + login
    await request(app).post("/api/auth/register").send({
      username: "updateuser",
      email: "update@test.com",
      password: "password123",
      fullName: "Update User"
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "update@test.com",
        password: "password123"
      });

    token = loginRes.body.token;

    // create sweet
    const sweetRes = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Barfi",
        category: "Indian",
        price: 30,
        quantity: 40
      });

    sweetId = sweetRes.body._id;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should update sweet details", async () => {
    const res = await request(app)
      .put(`/api/sweets/${sweetId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        price: 35,
        quantity: 50
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(35);
    expect(res.body.quantity).toBe(50);
  });
});
