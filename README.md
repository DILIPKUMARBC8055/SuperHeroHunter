Marvel Superhero Favorites


Marvel Superhero Favorites is a web application that allows users to explore Marvel superheroes and mark their favorite ones. The application leverages the Marvel Comics API to fetch superhero data and MongoDB to store users' favorite superheroes.

Features

Browse a list of Marvel superheroes.
View details of individual superheroes, including their description and associated comics.
Mark superheroes as favorites.
View a list of favorite superheroes.
Remove superheroes from favorites.


Technologies Used

Node.js: The backend of the application is built using Node.js, providing a runtime environment for JavaScript.
Express.js: Express.js is used to create the web server and handle HTTP requests.
MongoDB: MongoDB is used as the database to store information about favorite superheroes.
Mongoose: Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js, used to model the application data and interact with the MongoDB database.
React: The frontend of the application is built using React, a JavaScript library for building user interfaces.
Marvel Comics API: The application fetches superhero data from the Marvel Comics API to display information about Marvel superheroes.
dotenv: The dotenv package is used to load environment variables from a .env file.
crypto: The crypto module is used for cryptographic operations, such as generating MD5 hashes for authentication with the Marvel Comics API.


Getting Started
To run the application locally, follow these steps:

Clone the repository:

git clone (https://github.com/DILIPKUMARBC8055/SuperHeroHunter.git)

Install dependencies:
npm install


Create a .env file in the root directory of the project and add the following environment variables:

DB_URL=<your-mongodb-connection-string>
PUBLIC_KEY=<your-marvel-public-key>
PRIVATE_KEY=<your-marvel-private-key>

Replace <your-mongodb-connection-string> with the connection string for your MongoDB database, <your-marvel-public-key> with your Marvel Comics API public key, and <your-marvel-private-key> with your Marvel Comics API private key.

Start the server:

npm start
Visit http://localhost:3000 in your web browser to access the application.


Contributing
Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

Fork the repository.
Create a new branch for your feature or bug fix.
Make your changes and commit them to your branch.
Push your changes to your fork.
Submit a pull request to the main branch of the original repository.
