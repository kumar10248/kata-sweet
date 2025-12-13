require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("Search Sweets", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // register & login
    await request(app).post("/api/auth/register").send({
      username: "searchuser",
      email: "search@test.com",
      password: "password123",
      fullName: "Search User"
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "search@test.com",
        password: "password123"
      });

    token = loginRes.body.token;

    // seed sweets
    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Gulab Jamun",
        category: "Indian",
        price: 20,
        quantity: 50
      });

    await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Chocolate Cake",
        category: "Bakery",
        price: 100,
        quantity: 10
      });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should search sweets by category", async () => {
    const res = await request(app)
      .get("/api/sweets/search?category=Indian")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Gulab Jamun");
  });

  it("should search sweets by price range", async () => {
    const res = await request(app)
      .get("/api/sweets/search?minPrice=50&maxPrice=150")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Chocolate Cake");
  });
});
