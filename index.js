// Importing dotenv package to load environment variables from a .env file
import dotenv from "dotenv";
dotenv.config();
// Importing required modules
import express from "express"; // Express.js framework for building web applications
import bodyparser from "body-parser"; // Middleware to parse incoming request bodies
import ejs from "ejs"; // Templating engine for rendering dynamic content
import expressejslayout from "express-ejs-layouts"; // Layout support for EJS templates
import path from "path"; // Module for handling file paths
import connectToMongoDB from "./config/mongoose.config.js"; // Function to connect to MongoDB database
import superHeroRouter from "./src/route/superhero.route.js"; // Router for superhero-related endpoints

// Creating an Express server instance
const server = express();

// Middleware for setting CORS headers to allow cross-origin requests
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Middleware for parsing JSON bodies of incoming requests
server.use(bodyparser.json());
server.use(express.json());

// Configuring views directory and templating engine
server.set("views", path.join(path.resolve(), "src", "view")); // Set views directory
server.set("view engine", "ejs"); // Set EJS as the view engine
server.use(expressejslayout); // Enable layout support for EJS templates
server.use(express.static(path.join(path.resolve(), "src", "view"))); // Serving static files from the 'view' directory

// Mounting superhero router for handling superhero-related routes
server.use("/", superHeroRouter);

// Starting the server and listening on port 3000
server.listen(3000, async () => {
  console.log("server is listening at port 3000");
  // Connecting to MongoDB database when the server starts
  await connectToMongoDB();
});
