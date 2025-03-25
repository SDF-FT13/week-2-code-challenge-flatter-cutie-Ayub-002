// Your code here
document.addEventListener("DOMContentLoaded", () => {
    const characterBar = document.getElementById("character-bar");
    const nameElement = document.getElementById("name");
    const imageElement = document.getElementById("image");
    const voteCount = document.getElementById("vote-count");
    const votesForm = document.getElementById("votes-form");
    const resetButton = document.getElementById("reset-btn");
    const characterForm = document.getElementById("character-form");

    let currentCharacter = null;

    function fetchCharacters() {
        fetch("http://localhost:3000/characters")
            .then(response => response.json())
            .then(characters => {
                characters.forEach(addCharacterToBar);
            });
    }

    function addCharacterToBar(character) {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.addEventListener("click", () => displayCharacter(character));
        characterBar.appendChild(span);
    }

    function displayCharacter(character) {
        currentCharacter = character;
        nameElement.textContent = character.name;
        imageElement.src = character.image;
        voteCount.textContent = character.votes;
    }

    votesForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const votes = parseInt(document.getElementById("votes").value, 10);
        if (currentCharacter && !isNaN(votes)) {
            currentCharacter.votes += votes;
            voteCount.textContent = currentCharacter.votes;
            updateVotesOnServer(currentCharacter);
        }
        votesForm.reset();
    });

    function updateVotesOnServer(character) {
        fetch(`http://localhost:3000/characters/${character.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ votes: character.votes })
        });
    }

    resetButton.addEventListener("click", () => {
        if (currentCharacter) {
            currentCharacter.votes = 0;
            voteCount.textContent = 0;
            updateVotesOnServer(currentCharacter);
        }
    });

    characterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.getElementById("new-name").value;
        const image = document.getElementById("new-image").value;
        const newCharacter = { name, image, votes: 0 };
        
        fetch("http://localhost:3000/characters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCharacter)
        })
        .then(response => response.json())
        .then(character => {
            addCharacterToBar(character);
            displayCharacter(character);
        });
        
        characterForm.reset();
    });

    fetchCharacters();
});