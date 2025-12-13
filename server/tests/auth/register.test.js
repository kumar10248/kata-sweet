const request = require("supertest");
const express = require("express");


const app = express();
app.use(express.json());

describe("POST /api/auth/register", () => {
  it("should register a user and return 201", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "kumar",
        email: "kumar@test.com",
        password: "123456",
        fullName: "Kumar Devashish"
      });

    expect(response.statusCode).toBe(201);
  });
});
