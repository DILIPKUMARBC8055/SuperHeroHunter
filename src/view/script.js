// Fetch favorite superheroes when the page loads
let favChar = [];
async function fetchFavoriteSuperheroes() {
  try {
    const response = await fetch("/favoriteHeros");
    const data = await response.json();
    favChar = data;
  } catch (error) {
    console.error("Error fetching favorite superheroes:", error);
  }
}

// Fetch superheroes from the Marvel API
async function fetchSuperheroes() {
  try {
    const response = await fetch("/getkey");
    if (!response.ok) {
      throw new Error("There was an error fetching key");
    }
    const data = await response.json();
    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters${data}`;
    const responseSuperheroes = await fetch(apiUrl);
    const superheroesData = await responseSuperheroes.json();
    const superheroes = superheroesData.data.results;
    displaySuperheroes(superheroes);
  } catch (error) {
    console.error("Error fetching superheroes:", error);
  }
}

// Display superheroes in the UI
function displaySuperheroes(superheroes) {
  const superheroesList = document.getElementById("superheroesList");
  superheroesList.innerHTML = "";

  superheroes.forEach((superhero) => {
    const superheroCard = createSuperheroCard(superhero);
    superheroesList.appendChild(superheroCard);
  });
}

// Create HTML elements for a superhero card
function createSuperheroCard(superhero) {
  const superheroCard = document.createElement("div");
  superheroCard.classList.add("superhero");

  superheroCard.innerHTML = `
      <img src="${superhero.thumbnail.path}.${superhero.thumbnail.extension}" alt="${superhero.name}">
      <h2>${superhero.name}</h2>
      <button class="btn greenbtn">View full details</button>
      <p style="display:none">${superhero.id}</p>
    `;

  const favbtn = createFavoriteButton(superhero.id);
  superheroCard.appendChild(favbtn);

  return superheroCard;
}

// Create favorite button for a superhero card
function createFavoriteButton(superheroId) {
  const favbtn = document.createElement("button");
  favbtn.classList.add("btn", "favoriteBtn");
  if (favChar.indexOf(superheroId.toString()) == -1) {
    favbtn.textContent = "Favorite";
  } else {
    favbtn.textContent = `Added to Fav`;
  }
  return favbtn;
}

// Fetch and display details of a superhero when clicked
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("greenbtn")) {
    const id = event.target.nextElementSibling.textContent;
    const superheroesList = document.getElementById("superheroesList");
    superheroesList.style.display = "none";

    try {
      const response = await fetch("/getkey");
      if (!response.ok) {
        throw new Error("There was an error fetching key");
      }
      const data = await response.json();
      const apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}${data}`;
      const responseSuperhero = await fetch(apiUrl);
      const superheroData = await responseSuperhero.json();
      renderCharacterDetails(superheroData);
    } catch (error) {
      console.error("Error fetching superhero details:", error);
    }
  }
});

// Render details of a superhero
function renderCharacterDetails(data) {
  const details = document.getElementById("detailsChar");
  details.style.display = "block";

  const character = data.data.results[0];
  const characterImage = document.getElementById("characterImage");
  const characterDetails = document.getElementById("characterDetails");
  const attributionText = document.getElementById("attributionText");

  characterImage.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;

  let html = `<h2>${character.name}</h2>`;
  html += `<p>Description: ${
    character.description || "No description available"
  }</p>`;
  html += `<p>Comics Available: ${character.comics.available}</p>`;
  html += '<div class="comic-list"><h3>Comics:</h3><ul>';
  character.comics.items.forEach((comic) => {
    html += `<li><a href="${comic.resourceURI}">${comic.name}</a></li>`;
  });
  html += "</ul></div>";

  characterDetails.innerHTML = html;
  attributionText.innerHTML = data.attributionText;
}

// Event listener for favorite button
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("favoriteBtn")) {
    const superheroId = event.target.previousElementSibling.textContent;

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
        favChar.push(superheroId);
      } else {
        throw new Error("Failed to add superhero to favorites");
      }
    } catch (error) {
      console.error("Error adding superhero to favorites:", error);
    }
  }
});

// Event listener for search input
document.getElementById("searchInput").addEventListener("input", (event) => {
  searchSuperheroes(event.target.value);
});

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

// Event listener for displaying favorite superheroes
document.getElementById("favHeros").addEventListener("click", async () => {
  if (favChar.length == 0) {
    const superheroesList = document.getElementById("superheroesList");
    superheroesList.innerHTML = `<h1 style="color: whitesmoke;">No character added to Favorite</h1>`;
    return;
  }

  try {
    const response = await fetch("/getkey");
    if (!response.ok) {
      throw new Error("There was an error fetching key");
    }
    const data = await response.json();
    const heroes = [];

    await Promise.all(
      favChar.map(async (id) => {
        const apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}${data}`;
        const responseHero = await fetch(apiUrl);
        const heroData = await responseHero.json();
        const superhero = heroData.data.results[0];
        heroes.push(superhero);
      })
    );

    displaySuperheroes(heroes);
  } catch (error) {
    console.error("Error fetching favorite superheroes:", error);
  }
});

// Initial actions when the page loads
window.onload = async () => {
  const details = document.getElementById("detailsChar");
  details.style.display = "none";

  await fetchFavoriteSuperheroes();
  await fetchSuperheroes();
};
