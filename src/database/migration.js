// Import dependencies
import bcrypt from "bcrypt";

// Import models
import Client from "../models/Client.js";
import Purchase from "../models/Purchase.js";

// Import project files
import config from "../config/app-config.js";
import Database from "./connection.js";

const db = new Database();
const connPromise = db.connect();

connPromise
  .then(async (result) => {
    console.log(result);

    for (let model of [Client, Purchase]) {
      let list = await model.db.db
        .listCollections({
          name: model.collection.name,
        })
        .toArray();

      if (list.length !== 0) {
        await model.collection.drop();
      } else {
        console.log("Collection %s does not exist.", model.collection.name);
      }
    }

    const clients = [
      new Client({
        username: "admin",
        email: "admin@admin.com",
        password: await bcrypt.hash("123456", config.app.saltRounds),
      }),
      new Client({
        username: "test_user",
        email: "test@testmail.com",
        password: await bcrypt.hash("123456", config.app.saltRounds),
      }),
      new Client({
        username: "appNewUser999",
        email: "appuser@nomail.com",
        password: await bcrypt.hash("123456", config.app.saltRounds),
      }),
    ];

    for (const client of clients) {
      try {
        await client.save();
        console.log('Client document for "' + client.username + '" created.');
      } catch (e) {
        console.log("Error: " + e);
      }
    }

    const createdClients = await Client.find({});

    function getRandomClientId() {
      const randomPosition = Math.floor(Math.random() * createdClients.length);
      return createdClients[randomPosition]._id;
    }

    const purchases = [
      new Purchase({
        buyer_id: getRandomClientId(),
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam posuere aliquet ex in dapibus. Sed elementum, ipsum id luctus hendrerit, elit risus congue metus, sit amet iaculis velit nisi ut magna. Curabitur sed orci leo. Curabitur pretium dolor in vestibulum scelerisque. Duis eget sollicitudin odio, vitae euismod tellus. Duis dictum elementum eros a volutpat. Sed nec magna leo. Suspendisse suscipit lorem a ante imperdiet, a dictum risus sodales. Aenean porttitor, augue et vehicula efficitur, nisl risus malesuada justo, vitae venenatis tellus turpis at magna. Pellentesque viverra ac mauris id gravida. Nam luctus eros in elit iaculis ullamcorper. Sed rutrum elit eget facilisis maximus. Proin a posuere dolor.",
        price: 300000,
        propertyType: "Home",
        homeType: "Flat/Apartment",
        numBedrooms: "3",
        numBathrooms: "2",
        equipment: "Furnished",
        condition: "New",
        publicationDate: new Date(),
        location: {
          latitude: 41.39265,
          longitude: 2.14935,
        },
        images: null,
        services: ["Lift", "Terrace"],
      }),
      new Purchase({
        buyer_id: getRandomClientId(),
        description:
          "Sed ultrices gravida molestie. Aliquam cursus magna non mi cursus, ut hendrerit elit congue. Aliquam et metus id libero finibus vulputate in sit amet ligula. Praesent sed elit eu nibh facilisis viverra. Morbi varius egestas congue. Nunc a laoreet ex. Nam imperdiet risus in ipsum semper, eget consequat quam varius. Maecenas vulputate sollicitudin cursus. Nulla lobortis vestibulum purus, eget ultricies ex egestas quis. Mauris fringilla, purus in consequat semper, velit mauris tincidunt diam, maximus pharetra leo nulla sit amet purus. Nulla facilisi. Aenean interdum tortor quis augue viverra, nec euismod dui vehicula.",
        price: 250000,
        propertyType: "Office",
        buildingUse: "Co-working",
        publicationDate: new Date(2019, 5, 3, 12),
        location: {
          latitude: 41.37514,
          longitude: 2.1548,
        },
        images: null,
        services: ["Lift", "Air conditioning"],
      }),
      new Purchase({
        buyer_id: getRandomClientId(),
        description:
          "Maecenas posuere posuere libero. Nulla facilisi. Aliquam eleifend, quam ut sodales malesuada, arcu tellus imperdiet odio, ac luctus nulla metus non ante. Quisque dolor enim, elementum non interdum vitae, rutrum eget urna. Morbi accumsan orci ut nisi iaculis maximus. Etiam faucibus magna eget tellus condimentum, eget blandit arcu lobortis. Aliquam erat volutpat.",
        price: 725000,
        propertyType: "Home",
        homeType: "Duplex",
        numBedrooms: "4 or +",
        numBathrooms: "3 or +",
        equipment: "Indifferent",
        condition: "Good condition",
        publicationDate: new Date(2020, 0, 30, 12),
        location: {
          latitude: 41.38919,
          longitude: 2.12025,
        },
        images: null,
        services: ["Pets allowed", "Garden"],
      }),
    ];

    for (const purchase of purchases) {
      try {
        await purchase.save();
        console.log("Purchase document created.");
      } catch (e) {
        console.log("Error: " + e);
      }
    }

    const closePromise = db.close();
    closePromise.then((res) => console.log(res)).catch((e) => console.log(e));
  })
  .catch((error) => console.log(error));
