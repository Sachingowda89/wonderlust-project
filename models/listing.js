const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;

const listengSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://th.bing.com/th/id/R.786a70695c617f764b69cfce9b7a4999?...",
      set: (v) =>
        v === ""
          ? "https://th.bing.com/th/id/R.786a70695c617f764b69cfce9b7a4999?..."
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },     
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
});

const listing=mongoose.model("listing",listengSchema);
module.exports=listing;
