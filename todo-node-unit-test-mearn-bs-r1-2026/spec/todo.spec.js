const request = require("supertest");
const server = require("..");
const { clearDatabase } = require("../db.connection");

const api = request(server);

describe("Todo API Tests", () => {
  const testUser = { email: "test@test.com", password: "1234", name: "Ali" };
  let authToken, todoId;

  beforeAll(async () => {
    await api.post("/user/signup").send(testUser);
    const loginRes = await api.post("/user/login").send(testUser);
    authToken = loginRes.body.data;
  });

  it("GET /todo/ should return an empty list", async () => {
    const res = await api.get("/todo/");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("POST /todo without token should return 401", async () => {
    const res = await api.post("/todo").send({ title: "eat food" });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/login first/i);
  });

  it("POST /todo with token should create a new todo", async () => {
    const res = await api
      .post("/todo")
      .send({ title: "eat food" })
      .set({ authorization: authToken });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe("eat food");
    todoId = res.body.data._id;
  });

  it("GET /todo/:id should return the created todo", async () => {
    const res = await api
      .get(`/todo/${todoId}`)
      .set({ authorization: authToken });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("eat food");
  });

  afterAll(async () => {
    await clearDatabase();
  });
});
