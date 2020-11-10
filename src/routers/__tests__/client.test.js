// Import dependencies
import express from "express";
import request from "supertest";

// Import router
import clientRouter from "../client.js";

// Import controller
import clientController from "../../controllers/client.js";

// Instance of express app ("fake" express app)
const app = express();
app.use(express.json());

// Routes
app.use("/client-test", clientRouter);

let spyMethodFindById = null;
let spyMethodFindDeletedById = null;
let spyMethodUpdateClientById = null;
let spyMethodDeleteClient = null;

describe("Testing client routes", () => {
  beforeAll(async () => {
    clientController.findById = jest.fn().mockResolvedValue({
      _id: { $oid: "5fa70d406c2310fdff0c80e9" },
      email: "admin@admin.com",
      username: "admin",
      avatar: "default.jpg",
    });

    clientController.findDeletedById = jest.fn().mockResolvedValue(null);
    clientController.updateClientById = jest.fn().mockResolvedValue(null);
    clientController.deleteClient = jest.fn().mockResolvedValue(null);

    spyMethodFindById = jest.spyOn(clientController, "findById");
    spyMethodFindDeletedById = jest.spyOn(clientController, "findDeletedById");
    spyMethodUpdateClientById = jest.spyOn(
      clientController,
      "updateClientById"
    );
    spyMethodDeleteClient = jest.spyOn(clientController, "deleteClient");
  });

  afterAll(() => {
    spyMethodFindById.mockClear();
    spyMethodFindDeletedById.mockClear();
    spyMethodUpdateClientById.mockClear();
    spyMethodDeleteClient.mockClear();
  });

  test("GET - get an existing client", async () => {
    expect.assertions(3);

    const response = await request(app)
      .get("/client-test")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYTcwZDQwNmMyMzEwZmRmZjBjODBlOSIsImlhdCI6MTYwNDg0MzY2NH0.PfE0X8DmzJrI_qjg-tt6xI4LghGVNCdQQ21xEWZgZk8"
      );
    expect(response.status).toEqual(200);
    expect(clientController.findById).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.text)).toMatchObject({ error: null, data: {} });
  });

  test("PATCH - Update an existing client", async () => {
    expect.assertions(4);

    const response = await request(app)
      .patch("/client-test")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYTcwZDQwNmMyMzEwZmRmZjBjODBlOSIsImlhdCI6MTYwNDg0MzY2NH0.PfE0X8DmzJrI_qjg-tt6xI4LghGVNCdQQ21xEWZgZk8"
      );

    expect(response.status).toEqual(200);
    expect(clientController.findDeletedById).toHaveBeenCalledTimes(1);
    expect(clientController.updateClientById).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.text)).toMatchObject({
      error: null,
      data: "Client data updated!",
    });
  });

  test("DELETE - Delete existing client", async () => {
    expect.assertions(3);

    const response = await request(app)
      .delete("/client-test")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYTcwZDQwNmMyMzEwZmRmZjBjODBlOSIsImlhdCI6MTYwNDg0MzY2NH0.PfE0X8DmzJrI_qjg-tt6xI4LghGVNCdQQ21xEWZgZk8"
      );

    expect(response.status).toEqual(200);
    expect(clientController.deleteClient).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.text)).toMatchObject({
      error: null,
      data: "Client deleted!",
    });
  });
});
