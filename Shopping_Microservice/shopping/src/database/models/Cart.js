const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    customerId: String,
    items: [
      {
        product: {
          _id: { type: String, required: true },
          name: String,
          banner: String,
          price: Number,
          desc: String,
          type: String,
          unit: Number,
          suplier: String,
        },
        unit: { type: Number, required: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", CartSchema);
