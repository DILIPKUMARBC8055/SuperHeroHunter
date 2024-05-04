import mongoose from "mongoose";

const marvelSchema = mongoose.Schema({
  id: { type: String },
});

const MarverModel = mongoose.model("marvel", marvelSchema);
export default MarverModel;
