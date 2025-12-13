require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("List Sweets", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // register user
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "listsweetuser",
        email: "listsweet@test.com",
        password: "password123",
        fullName: "List Sweet User"
      });

    // login
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "listsweet@test.com",
        password: "password123"
      });

    token = loginRes.body.token;

    // create sweets
    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Rasgulla",
        category: "Indian",
        price: 15,
        quantity: 30
      });

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Ladoo",
        category: "Indian",
        price: 10,
        quantity: 50
      });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should return list of sweets", async () => {
    const res = await request(app)
      .get("/api/sweets")
      .set("Authorization", `Bearer ${token}`);

   expect(Array.isArray(res.body.data)).toBe(true);
expect(res.body.data.length).toBe(2);
expect(res.body.pagination.total).toBe(2);

  });
});
