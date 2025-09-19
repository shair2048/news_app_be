import request from "supertest";
import app from "../../src/app.js";
import { describe, expect, it } from "vitest";

describe("GET /api/articles", () => {
  it("should fetch all articles", async () => {
    const response = await request(app).get("/api/articles");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
