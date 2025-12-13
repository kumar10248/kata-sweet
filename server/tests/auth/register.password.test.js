require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

describe("User Registration - Password Hashing", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  it("should store hashed password instead of plain text", async () => {
    const plainPassword = "mypassword123";

    await request(app)
      .post("/api/auth/register")
      .send({
        username: "hashuser",
        email: "hash@test.com",
        password: plainPassword,
        fullName: "Hash User"
      })
      .expect(201);

    const user = await mongoose.connection.db
      .collection("users")
      .findOne({ email: "hash@test.com" });

    expect(user.password).not.toBe(plainPassword);
  });
});
