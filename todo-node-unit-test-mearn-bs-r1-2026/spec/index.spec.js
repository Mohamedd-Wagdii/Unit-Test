const request = require("supertest");
const server = require("..");

const api = request(server);

describe("Testing main routes", () => {
  it("GET / should return empty todos list", async () => {
    const response = await api.get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(0);
  });

  it("GET /unknown should give 404 error", async () => {
    const response = await api.get("/unknown");
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Not found");
  });
});
