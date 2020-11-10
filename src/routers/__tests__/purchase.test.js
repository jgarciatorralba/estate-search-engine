// Import dependencies
import express from "express";
import request from "supertest";

// Import router
import purchaseRouter from "../purchase.js";

// Import controller
import clientController from "../../controllers/client.js";

// Instance of express app ("fake" express app)
const app = express();
app.use(express.json());

// Routes
app.use("/purchase-test", purchaseRouter);

let spyMethodFindWithDeletedById = null;

describe("Testing purchase routes", () => {
  beforeAll(async () => {
    clientController.findWithDeletedById = jest.fn().mockResolvedValue(null);

    spyMethodFindWithDeletedById = jest.spyOn(
      clientController,
      "findWithDeletedById"
    );
  });

  afterAll(() => {
    spyMethodFindWithDeletedById.mockClear();
  });

  test("GET - get purchases by client id", async () => {
    expect.assertions(3);

    const response = await request(app)
      .get("/purchase-test/any-given-id")
      .set(
        "Authorization",
        "Bearer 928e9861d5f1d573801e4dfd6178f55be55932627ac761944b8a66cbc7c95449"
      );

    expect(clientController.findWithDeletedById).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(400);
    expect(JSON.parse(response.text)).toMatchObject({
      error: "Client not found",
      data: null,
    });
  });
});
