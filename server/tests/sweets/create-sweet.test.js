require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("Sweet Creation", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // register user
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "sweetuser",
        email: "sweet@test.com",
        password: "password123",
        fullName: "Sweet User"
      });

    // login user
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "sweet@test.com",
        password: "password123"
      });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should allow authenticated user to create a sweet", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 20,
        quantity: 50
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Gulab Jamun");
  });
});
