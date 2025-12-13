require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("User Registration - Persistence", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should save the user to database on registration", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "kumar123",
        email: "kumar123@test.com",
        password: "123456",
        fullName: "Kumar Devashish"
      })
      .expect(201);

    const users = await mongoose.connection.db
      .collection("users")
      .find({ email: "kumar123@test.com" })
      .toArray();

    expect(users.length).toBe(1);
  });
});
