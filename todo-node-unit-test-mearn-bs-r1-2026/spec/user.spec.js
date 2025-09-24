const request = require("supertest");
const server = require("..");
const { clearDatabase } = require("../db.connection");

const api = request(server);

describe("User API Routes", () => {
  const sampleUser = { email: "test@test.com", password: "1234", name: "Ali" };

  it("GET /user/ should return an empty array initially", async () => {
    const res = await api.get("/user/");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("POST /user/signup should create a new user", async () => {
    const res = await api.post("/user/signup").send(sampleUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.email).toBe(sampleUser.email);
  });

  it("POST /user/signup without name should return validation error", async () => {
    const invalidUser = { email: "test2@test.com", password: "1234" };
    const res = await api.post("/user/signup").send(invalidUser);
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/Name is required/);
  });

  it("POST /user/login should return a token", async () => {
    const res = await api.post("/user/login").send(sampleUser);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  afterAll(async () => {
    await clearDatabase();
  });
});
