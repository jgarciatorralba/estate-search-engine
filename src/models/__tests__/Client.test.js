// Import dependendices
import mongoose from "mongoose";

// Import model
import Client from "../Client.js";

// Import configuration object
import config from "../../config/app-config.js";

describe("Performing CRUD over Client model in test database", () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(
        `mongodb+srv://${config.db.user}:${config.db.pass}@${config.db.cluster}.z1ipk.mongodb.net/${config.db.test_name}`,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          retryWrites: true,
          useCreateIndex: true,
          w: "majority",
        }
      );
      await Client.deleteMany({});
    } catch (error) {
      return error;
    }
  });

  afterEach(async () => {
    await Client.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection
      .close()
      .then(() => resolve("MongoDB connection closed..."))
      .catch((error) => reject(error));
  });

  test("Create a new client", async () => {
    const newClient = new Client({
      email: "jest-test@newclient.com",
      username: "jest-new-client",
      password: "123456",
    });

    const savedClient = await newClient.save();
    expect(savedClient.username).toBe("jest-new-client");
  });

  test("Get an existing client", async () => {
    expect.assertions(2);

    const newClient = new Client({
      email: "jest-test@newclient.com",
      username: "jest-new-client",
      password: "123456",
    });

    await newClient.save();

    const results = await Client.findOne({ email: "jest-test@newclient.com" });
    expect(results).toBeDefined();
    expect(results.password).toBe("123456");
  });

  test("Update a client", async () => {
    expect.assertions(2);

    const newClient = new Client({
      email: "jest-test@newclient.com",
      username: "jest-new-client",
      password: "123456",
    });

    const savedClient = await newClient.save();
    await Client.updateOne(
      { username: "jest-new-client" },
      { email: "new-jest-email@test.com" }
    );
    const results = await Client.findOne({ email: "new-jest-email@test.com" });
    expect(results).not.toBeNull();
    expect(results._id).toEqual(savedClient._id);
  });

  test("Delete a client", async () => {
    const newClient = new Client({
      email: "jest-test@newclient.com",
      username: "jest-new-client",
      password: "123456",
    });

    await newClient.save();
    await Client.deleteOne({ email: "jest-test@newclient.com" });
    const results = await Client.findOne({ email: "jest-test@newclient.com" });
    expect(results).toBeNull();
  });
});
