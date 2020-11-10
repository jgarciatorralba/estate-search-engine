// Import dependendices
import mongoose from "mongoose";

// Import controller
import purchaseController from "../Purchase.js";

// Import model
import Purchase from "../../models/Purchase.js";

// Import configuration object
import config from "../../config/app-config.js";

describe("Performing CRUD over Purchase controller in test database", () => {
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
      await Purchase.deleteMany({});
    } catch (error) {
      return error;
    }
  });

  afterEach(async () => {
    await Purchase.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("Register a new purchase", async () => {
    let purchase = {
      buyer_id: "5faa745aa44c321745ed7e08",
      description:
        "Ut bibendum lobortis placerat. Nulla eu cursus nisi. Nullam posuere nec leo vitae commodo. Aenean ac lorem molestie, viverra ipsum non, varius risus. Ut blandit urna fermentum nibh porta, sit amet tincidunt urna consequat. Cras commodo nibh non lacus viverra eleifend. Suspendisse a laoreet mi. Nullam vulputate blandit nulla vel efficitur. In volutpat, diam vitae pharetra tincidunt, est erat rhoncus metus, at mollis nisi lorem et ex. Morbi facilisis sollicitudin varius. Mauris nec quam nisi. Vestibulum pharetra pellentesque tellus vel hendrerit. Duis eu tortor et eros ultricies viverra eu sit amet enim. Sed aliquet risus in ex varius condimentum. Pellentesque ut nunc eu mauris congue pretium. Duis sit amet sollicitudin felis.",
      price: 1000000,
      images: [
        "https://cdn.pixabay.com/photo/2016/11/18/17/46/architecture-1836070_1280.jpg",
        "https://cdn.pixabay.com/photo/2018/01/24/15/08/live-3104077_1280.jpg",
      ],
      services: ["Garden", "Swimming pool"],
      location: {
        latitude: 41.4034,
        longitude: 2.12772,
      },
      publicationDate: "Nov 7, 2020 12:00:00",
      propertyType: "Home",
      homeType: "Penthouse",
      numBedrooms: "4 or +",
      numBathrooms: "3 or +",
      equipment: "Furnished",
      condition: "New",
    };

    const error = await purchaseController.create(purchase);
    expect(error).toBeNull();
  });
});
