import request from "supertest";
import app from "../../src/app.js";
import { describe, expect, it } from "vitest";

describe("GET /api/users", () => {
  it("should fetch all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});
