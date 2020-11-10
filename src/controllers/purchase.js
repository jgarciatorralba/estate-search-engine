// Import models
import Purchase from "../models/Purchase.js";

export default {
  create: async function (purchaseObj) {
    let newPurchase;
    if (purchaseObj.propertyType == "Home") {
      newPurchase = new Purchase({
        buyer_id: purchaseObj.buyer_id,
        description: purchaseObj.description,
        price: purchaseObj.price,
        propertyType: purchaseObj.propertyType,
        images: purchaseObj.images,
        services: purchaseObj.services,
        location: purchaseObj.location,
        publicationDate: purchaseObj.publicationDate,
        homeType: purchaseObj.homeType,
        numBedrooms: purchaseObj.numBedrooms,
        numBathrooms: purchaseObj.numBathrooms,
        equipment: purchaseObj.equipment,
        condition: purchaseObj.condition,
      });
    } else if (purchaseObj.propertyType == "Office") {
      newPurchase = new Purchase({
        buyer_id: purchaseObj.buyer_id,
        description: purchaseObj.description,
        price: purchaseObj.price,
        propertyType: purchaseObj.propertyType,
        images: purchaseObj.images,
        services: purchaseObj.services,
        location: purchaseObj.location,
        publicationDate: purchaseObj.publicationDate,
        buildingUse: purchaseObj.buildingUse,
      });
    }

    try {
      await newPurchase.save();
    } catch (error) {
      return error;
    }

    return null;
  },

  findAll: async function () {
    let purchases;
    try {
      purchases = await Purchase.find({});
    } catch (error) {
      return error;
    }

    return purchases;
  },

  findPurchasesByBuyerId: async function (buyer_id) {
    let purchases;
    try {
      purchases = await Purchase.find({ buyer_id: buyer_id });
    } catch (error) {
      return error;
    }

    return purchases;
  },
};
