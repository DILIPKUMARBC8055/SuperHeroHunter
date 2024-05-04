// Importing necessary modules
import dotenv from "dotenv"; // Module to load environment variables from a .env file
dotenv.config();
import path from "path"; // Module for handling file paths
import crypto from "crypto"; // Module for cryptographic operations
import MarverModel from "../../config/marvel.schema.js"; // Mongoose model for Marvel superheroes

// Exporting heroController class
export default class heroController {
  // Method to render the home page
  homePage(req, res) {
    res.render(path.join(path.resolve(), "src", "view", "layout"));
  }

  // Method to get the key required for accessing the Marvel API
  getkey(req, res) {
    const key = getkeys();
    res.json(key);
  }

  // Method to get details of favorite superheroes
  async getfavCar(req, res) {
    const favChars = mongoose.model("marvel");
    const favs = await favChars.find();
    console.log(favs);
    res.json(favs);
  }

  // Method to get IDs of all favorite superheroes
  async getAllFav(req, res) {
    const supresheros = [];
    try {
      const heros = await MarverModel.find();

      heros.forEach((ele) => {
        supresheros.push(ele.id);
      });

      res.json(supresheros);
    } catch (error) {
      console.log(error);
    }
  }

  // Method to add a superhero to favorites
  async addToFav(req, res) {
    const { superheroId } = req.body;

    try {
      // Check if superheroId already exists
      const existingSuperhero = await MarverModel.findOne({ superheroId });
      if (existingSuperhero) {
        return res
          .status(400)
          .json({ message: "Superhero already added to favorites" });
      }
      // Create new favorite superhero document
      const superid = new MarverModel({ id: superheroId });
      await superid.save();
      res.json({ message: "Superhero added to favorites" });
    } catch (error) {
      console.error("Error adding favorite superhero:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method to remove a superhero from favorites
  async removeFav(req, res) {
    const { superheroId } = req.body;

    try {
      // Delete favorite superhero document
      await MarverModel.deleteOne({ id: superheroId });
      res.json({ message: "Superhero removed from favorites" });
    } catch (error) {
      console.error("Error removing favorite superhero:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

// Function to generate the required key for accessing the Marvel API
function getkeys() {
  const publicKey = process.env.PUBLIC_KEY.toString();
  const privateKey = process.env.PRIVATE_KEY.toString();
  const ts = new Date().getTime().toString();
  const hash = crypto.createHash("md5");
  hash.update(ts);
  hash.update(privateKey);
  hash.update(publicKey);
  const digest = hash.digest("hex");
  return `?ts=${ts}&apikey=${publicKey}&hash=${digest}`;
}
