import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyparser from "body-parser";
import ejs from "ejs";
import expressejslayout from "express-ejs-layouts";
import path from "path";
import crypto from "crypto";
import { Server } from "socket.io";
import connectToMongoDB from "./config/mongoose.config.js";
import mongoose from "mongoose";
import MarverModel from "./config/marvel.schema.js";
const server = express();

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

server.use(bodyparser.json());
server.use(express.json());
server.set("views", path.join(path.resolve(), "src", "view")); // Set views directory
server.set("view engine", "ejs");
server.use(expressejslayout);
server.use(express.static(path.join(path.resolve(), "src", "view")));
server.get("/getfavChar", async (req, res) => {
  const favChars = mongoose.model("marvel");
  const favs = await favChars.find();
  console.log(favs);
  res.json(favs);
});
server.get("/getkey", (req, res) => {
  const key = getkeys();
  res.json(key);
});
server.get("/favoriteHeros", async (req, res) => {
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
});

server.post("/addfavChar", async (req, res) => {
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
});

server.delete("/removefavChar", async (req, res) => {
  const { superheroId } = req.body;

  try {
    // Delete favorite superhero document
    await MarverModel.deleteOne({ id: superheroId });
    res.json({ message: "Superhero removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite superhero:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
server.use("/", (req, res) => {
  res.render(path.join(path.resolve(), "src", "view", "layout"));
});

server.listen(3000, async () => {
  console.log("server is listening at port 3000");
  await connectToMongoDB();
});

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
