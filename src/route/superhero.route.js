// Importing the Router class from Express.js for creating router instances
import { Router } from "express";

// Importing the heroController from "../controller/hero.controller.js" file
import heroController from "../controller/hero.controller.js";

// Creating a new router instance
const superHeroRouter = Router();

// Creating a new instance of heroController
const hero = new heroController();

// Defining routes and associating them with corresponding controller methods

// Route to get the key for accessing Marvel API
superHeroRouter.get("/getkey", hero.getkey);

// Route to add a superhero to favorites
superHeroRouter.post("/addfavChar", hero.addToFav);

// Route to remove a superhero from favorites
superHeroRouter.delete("/removefavChar", hero.removeFav);

// Route to get all favorite superheroes
superHeroRouter.get("/favoriteHeros", hero.getAllFav);

// Route to get details of favorite superheroes
superHeroRouter.get("/getfavChar", hero.getfavCar);

// Route to the home page
superHeroRouter.get("/", hero.homePage);

// Exporting the superHeroRouter instance
export default superHeroRouter;
