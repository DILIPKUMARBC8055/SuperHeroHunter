import mongoose from "mongoose"; // Importing Mongoose library

// Defining the schema for Marvel superheroes
const marvelSchema = mongoose.Schema({
  id: { type: String }, // Schema field for superhero ID
});

// Creating a Mongoose model based on the schema
const MarverModel = mongoose.model("marvel", marvelSchema);

// Exporting the MarverModel
export default MarverModel;
