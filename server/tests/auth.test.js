import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../index"; // Your Express app
import User from "../models/User"; // Import User model for cleanup

// =================================================================
// DEVELOPER NOTE: For a robust test suite, you should use an
// in-memory MongoDB server (like 'mongodb-memory-server') or a
// dedicated test database. These tests run against your actual dev DB.
//
// The 'afterAll' hook is added to clean up the created test user.
// =================================================================

describe("Auth Routes", () => {
  const testUserEmail = `test-user-${Date.now()}@example.com`;

  // Cleanup the test user after all tests in this suite are done
  afterAll(async () => {
    await User.deleteOne({ email: testUserEmail });
  });

  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: testUserEmail,
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toBe(testUserEmail);
  });

  it("should fail to register a user with an existing email", async () => {
    // This now relies on the user created in the first test
    const res = await request(app).post("/api/auth/register").send({
      name: "Another User",
      email: testUserEmail,
      password: "password456",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should log in an existing user successfully", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUserEmail,
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail to log in with an incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUserEmail,
      password: "wrong-password",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe("Invalid email or password");
  });
});
