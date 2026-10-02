const request = require("supertest");

const app = require("../app");

describe("Authentication API", () => {
  test("GET / should return welcome message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body.message).toBe(
      "Welcome to Skillora API"
    );
  });

  test("POST /api/auth/login should reject empty data", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(response.statusCode).toBeGreaterThanOrEqual(400);
  });
});
