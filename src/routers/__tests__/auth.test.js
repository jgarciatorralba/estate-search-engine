// Import dependencies
import express from "express";
import request from "supertest";
import bcrypt from "bcrypt";

// Import router
import authRouter from "../auth.js";

// Import controller
import clientController from "../../controllers/client.js";

// Instance of express app ("fake" express app)
const app = express();
app.use(express.json());

// Routes
app.use("/auth-test", authRouter);

let spyController = null;
let spyBcrypt = null;

describe("Testing auth routes", () => {
  beforeAll(async () => {
    clientController.findByEmail = jest.fn().mockResolvedValue({
      _id: { $oid: "5fa70d406c2310fdff0c80e9" },
      avatar: "default.jpg",
      deleted: false,
      username: "admin",
      email: "admin@admin.com",
      password: "$2b$12$tf12p90fWgheioKyWLwC8.Am.Jh.HxPGuR2hokmrXzlBL6w0Sm13e",
      createdAt: { $date: "2020-11-07T21:10:25.446Z" },
      updatedAt: { $date: "2020-11-07T21:10:25.446Z" },
      __v: 0,
    });

    clientController.create = jest.fn().mockResolvedValue(null);
    spyController = jest.spyOn(clientController, "create");

    spyBcrypt = jest.spyOn(bcrypt, "compare");
  });

  beforeEach(() => {
    spyController.mockClear();
    spyBcrypt.mockClear();
  });

  test("POST - login existing user", async () => {
    expect.assertions(3);

    const loginObj = {
      username: "admin",
      email: "admin@admin.com",
      password: "123456",
    };

    const response = await request(app).post("/auth-test/login").send(loginObj);

    expect(response.status).toEqual(200);
    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "123456",
      "$2b$12$tf12p90fWgheioKyWLwC8.Am.Jh.HxPGuR2hokmrXzlBL6w0Sm13e"
    );
  });

  test("POST - register new user", async () => {
    expect.assertions(2);

    const registerObj = {
      username: "jest-test",
      email: "jest@test.com",
      password: "123456",
    };

    const response = await request(app)
      .post("/auth-test/register")
      .send(registerObj);

    expect(clientController.create).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(200);
  });
});
