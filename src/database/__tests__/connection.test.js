// Import dependencies
import mongoose from "mongoose";

// Import connection files
import Database from "../connection.js";

describe("Test the database connection", () => {
  beforeAll(async () => {
    await mongoose.connection.close();
  });

  test("Should connect to the database", (done) => {
    const db = new Database();
    const connPromise = db.connect();
    connPromise.then((result) => {
      expect(result).toBe("MongoDB connected...");
      done();
    });
  });

  test("Should disconnect from the database", (done) => {
    const db = new Database();
    const connPromise = db.close();
    connPromise.then((result) => {
      expect(result).toBe("MongoDB connection closed...");
      done();
    });
  });
});
