let favChar = [];
fetch("/favoriteHeros")
  .then((response) => response.json())
  .then((data) => {
    favChar = data;
  })
  .catch((err) => {
    console.log("there was error in fetching data" + err);
  });

// Fetch superheroes when the page loads
const details = document.getElementById("detailsChar");

if (details.style.display !== "none") {
  details.style.display = "none";
}
fetchSuperheroes();

function fetchSuperheroes() {
  // Example usage
  fetch("/getkey")
    .then((response) => {
      if (!response.ok) {
        console.log("There was error fetching key");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      const apiUrl = `https://gateway.marvel.com:443/v1/public/characters${data}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const superheroes = data.data.results;
          displaySuperheroes(superheroes);
        })
        .catch((error) => {
          console.error("Error fetching superheroes:", error);
        });
    });
}

// Function to display superheroes
function displaySuperheroes(superheroes) {
  const details = document.getElementById("detailsChar");

  if (details.style.display !== "none") {
    details.style.display = "none";
  }
  const superheroesList = document.getElementById("superheroesList");
  superheroesList.innerHTML = "";

  superheroes.forEach((superhero) => {
    const superheroCard = document.createElement("div");
    superheroCard.classList.add("superhero");

    superheroCard.innerHTML = `
        <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
        <h2>${superhero.name}</h2>
        <button  class="btn greenbtn"> view full details</button>
        <p style="display:none">${superhero.id}</p>
      `;

    const favbtn = document.createElement("button");
    favbtn.classList.add("btn", "favoriteBtn");
    if (favChar.indexOf(superhero.id.toString()) == -1) {
      favbtn.textContent = "Favorite";
    } else {
      favbtn.textContent = `Added to Fav`;
    }
    superheroCard.appendChild(favbtn);

    superheroesList.appendChild(superheroCard);
  });
}

// Function to filter superheroes based on search query
function searchSuperheroes(query) {
  const superheroes = document.querySelectorAll(".superhero");
  superheroes.forEach((superhero) => {
    const name = superhero.querySelector("h2").textContent.toLowerCase();
    if (name.includes(query.toLowerCase())) {
      superhero.style.display = "block";
    } else {
      superhero.style.display = "none";
    }
  });
}

// Event listener for search input
document.getElementById("searchInput").addEventListener("input", (event) => {
  searchSuperheroes(event.target.value);
});

// Event listener for favorite button
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("favoriteBtn")) {
    const superheroId = event.target.previousElementSibling.textContent;

    if (event.target.textContent == "Favorite") {
      try {
        const response = await fetch("/addfavChar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ superheroId }),
        });
        if (response.ok) {
          event.target.textContent = "Added to Fav";
          // Add superheroId to favChar array
          favChar.push(superheroId);
        } else {
          throw new Error("Failed to add superhero to favorites");
        }
      } catch (error) {
        console.error("Error adding superhero to favorites:", error);
      }
    } else if (event.target.textContent == "Added to Fav") {
      try {
        const response = await fetch("/removefavChar", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ superheroId }),
        });
        if (response.ok) {
          event.target.textContent = "Favorite";
          // Remove superheroId from favChar array
          const index = favChar.indexOf(superheroId);
          if (index !== -1) {
            favChar.splice(index, 1);
          }
        } else {
          throw new Error("Failed to remove superhero from favorites");
        }
      } catch (error) {
        console.error("Error removing superhero from favorites:", error);
      }
    }
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("greenbtn")) {
    const id = event.target.nextElementSibling.textContent;
    const superheroesList = document.getElementById("superheroesList");
    superheroesList.style.display = "none";

    fetch("/getkey")
      .then((response) => {
        if (!response.ok) {
          console.log("There was error fetching key");
        } else {
          return response.json();
        }
      })
      .then(async (data) => {
        const apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}${data}`;
        await fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            renderCharacterDetails(data);
          })
          .catch((error) => {
            console.error("Error fetching superheroes:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching superheroes:", error);
      });
  }
});

const favbtn = document.getElementById("favHeros");
favbtn.addEventListener("click", async (event) => {
  if (favChar.length == 0) {
    const suprehero = document.getElementById("superheroesList");
    suprehero.innerHTML = `<h1 style="color: whitesmoke;">No character added to Favorite</h1>`;
    return;
  }
  fetch("/getkey")
    .then((response) => {
      if (!response.ok) {
        console.log("There was error fetching key");
      } else {
        return response.json();
      }
    })
    .then(async (data) => {
      const heros = [];
      await favChar.forEach(async (id) => {
        const apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}${data}`;
        await fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            const superheroes = data.data.results[0];
            heros.push(superheroes);
          })
          .catch((error) => {
            console.error("Error fetching superheroes:", error);
          });
        displaySuperheroes(heros);
      });
    })
    .catch((error) => {
      console.error("Error fetching superheroes:", error);
    });
});

function renderCharacterDetails(data) {
  const details = document.getElementById("detailsChar");

  details.style.display = "block";

  var character = data.data.results[0];
  var characterImage = document.getElementById("characterImage");
  var characterDetails = document.getElementById("characterDetails");
  var attributionText = document.getElementById("attributionText");

  // Set character image
  characterImage.src =
    character.thumbnail.path + "." + character.thumbnail.extension;

  // Create character details HTML
  var html = "<h2>" + character.name + "</h2>";
  html +=
    "<p>Description: " +
    (character.description || "No description available") +
    "</p>";
  html += "<p>Comics Available: " + character.comics.available + "</p>";
  html += '<div class="comic-list">';
  html += "<h3>Comics:</h3>";
  html += "<ul>";
  character.comics.items.forEach(function (comic) {
    html +=
      '<li><a href="' + comic.resourceURI + '">' + comic.name + "</a></li>";
  });
  html += "</ul></div>";

  // Set character details HTML
  characterDetails.innerHTML = html;

  // Set attribution text
  attributionText.innerHTML = data.attributionText;
}
