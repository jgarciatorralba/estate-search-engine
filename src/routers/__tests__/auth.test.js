// Import dependencies
import express from "express";
import request from "supertest";

// Import connection
import Database from "../../database/connection.js";

// Import router
import authRouter from "../auth.js";

// Instance of express app ("fake" express app)
const app = express();
app.use(express.json());

// Routes
app.use("/auth-test", authRouter);

describe("Testing auth routes", () => {
  const db = new Database();

  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.close();
  });

  test("POST login existing user", async () => {
    const loginObj = {
      username: "admin",
      email: "admin@admin.com",
      password: "123456",
    };

    const response = await request(app).post("/auth-test/login").send(loginObj);

    expect(response.status).toEqual(200);
  });
});
