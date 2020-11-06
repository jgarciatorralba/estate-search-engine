import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  buyer_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ["EUR", "USD"],
    default: "EUR",
  },
  propertyType: {
    type: String,
    enum: ["Home", "Office"],
    required: true,
  },
  homeType: {
    type: String,
    enum: ["Flat/Apartment", "House", "Duplex", "Penthouse"],
    required: function () {
      return this.propertyType == "Home";
    },
  },
  numBedrooms: {
    type: String,
    enum: ["0", "1", "2", "3", "4 or +"],
    required: function () {
      return this.propertyType == "Home";
    },
  },
  numBathrooms: {
    type: String,
    enum: ["1", "2", "3 or +"],
    required: function () {
      return this.propertyType == "Home";
    },
  },
  equipment: {
    type: String,
    enum: ["Indifferent", "Fully fitted kitchen", "Furnished"],
    required: function () {
      return this.propertyType == "Home";
    },
  },
  condition: {
    type: String,
    enum: ["New", "Good condition", "Needs renovation"],
    required: function () {
      return this.propertyType == "Home";
    },
  },
  buildingUse: {
    type: String,
    enum: ["Private", "Co-working", "Security System"],
    required: function () {
      return this.propertyType == "Office";
    },
  },
  publicationDate: {
    type: Date,
    default: Date.now,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  images: {
    type: [String],
  },
  services: {
    type: [String],
    enum: [
      "Pets allowed",
      "Lift",
      "Air conditioning",
      "Garden",
      "Swimming pool",
      "Terrace",
    ],
  },
});

const Property = mongoose.model("Property", PropertySchema);

export default Property;
