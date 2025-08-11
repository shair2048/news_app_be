import request from "supertest";
import app from "../../src/app.js";
import { describe, expect, it } from "vitest";

// describe("GET /api/sign-up", () => {
//   it("should register successfully", async () => {
//     const response = await request(app).get("/api/sign-up");
//     expect(response.statusCode).toBe(200);
//     expect(response.body.length).toBeGreaterThan(0);
//   });
// });

describe("GET /api/sign-in", () => {
  it("should login successfully", async () => {
    const response = await request(app).get("/api/sign-in");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
