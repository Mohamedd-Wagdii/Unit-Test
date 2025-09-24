const request = require("supertest");
const server = require("..");
const { clearDatabase } = require("../db.connection");

const api = request(server);

describe("Lab Tests Suite", () => {
  const sampleUser = { email: "test@test.com", password: "1234", name: "Anas" };
  let authToken, todoId;

  beforeAll(async () => {
    await api.post("/user/signup").send(sampleUser);
    const loginRes = await api.post("/user/login").send(sampleUser);
    authToken = loginRes.body.data;
  });

  describe("User Endpoints", () => {
    it("GET /user/search should return the user if the name exists", async () => {
      const res = await api.get("/user/search").query({ name: "Anas" });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.name).toBe("Anas");
    });

    it("GET /user/search with invalid name should return 404 and an error message", async () => {
      const res = await api.get("/user/search").query({ name: "Nobody" });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toMatch(/There is no user with name/);
    });
  });

  describe("Todo Endpoints", () => {
    beforeAll(async () => {
      const res = await api
        .post("/todo")
        .send({ title: "First Todo" })
        .set({ authorization: authToken });

      todoId = res.body.data._id;
    });

    it("PATCH /todo/:id without body should return 400 and error message", async () => {
      const res = await api
        .patch(`/todo/${todoId}`)
        .send({})
        .set({ authorization: authToken });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/must provide title and id to edit todo/);
    });

    it("PATCH /todo/:id with title should update and return the todo", async () => {
      const res = await api
        .patch(`/todo/${todoId}`)
        .send({ title: "Modified Todo" })
        .set({ authorization: authToken });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe("Modified Todo");
      expect(res.body.data._id).toBe(todoId);
    });

    it("GET /todo/user should return all todos of the logged in user", async () => {
      const res = await api.get("/todo/user").set({ authorization: authToken });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe("Modified Todo");
    });

    it("GET /todo/user with a new user without todos should return a message", async () => {
      const newUser = { email: "bob@test.com", password: "1234", name: "Bob" };
      await api.post("/user/signup").send(newUser);
      const loginRes = await api.post("/user/login").send(newUser);
      const newToken = loginRes.body.data;

      const res = await api.get("/todo/user").set({ authorization: newToken });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toBeUndefined();
      expect(res.body.message).toMatch(/Couldn't find any todos/);
    });
  });

  afterAll(async () => {
    await clearDatabase();
  });
});
