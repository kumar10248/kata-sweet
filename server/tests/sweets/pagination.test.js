require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("Sweet Pagination", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    await request(app).post("/api/auth/register").send({
      username: "pageuser",
      email: "page@test.com",
      password: "password123",
      fullName: "Page User"
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "page@test.com",
        password: "password123"
      });

    token = login.body.token;

    for (let i = 1; i <= 15; i++) {
      await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: `Sweet ${i}`,
          category: "Test",
          price: i * 10,
          quantity: 10
        });
    }
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should return paginated sweets", async () => {
    const res = await request(app)
      .get("/api/sweets?page=2&limit=5")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(5);
    expect(res.body.pagination.page).toBe(2);
    expect(res.body.pagination.total).toBe(15);
  });
});
