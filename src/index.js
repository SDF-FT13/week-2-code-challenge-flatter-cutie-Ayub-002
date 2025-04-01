// Your code here
function characterNames() {
    fetch('http://localhost:3000/characters')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        displayCharacterNames(data);
        addCharacterClickListener(data); 
    })
}
function displayCharacterNames(characters) {
    let characterList = document.getElementById('character-bar');

characters.forEach(character => { 
    const list = document.createElement('span');
    list.innerText = character.name;  
    list.style.cursor = "pointer";  
    characterList.appendChild(list);
});
}
function addCharacterClickListener(characters) {
    let characterList = document.getElementById('character-bar');

characterList.addEventListener('click', event => {
    const clickedCharacter = characters.find(character => character.name === event.target.innerText);
    if (clickedCharacter) {
        displayCharacterDetails(clickedCharacter);
    }
});
}
let characterId;
function displayCharacterDetails(character) {
    characterId=character.id
    let detailDiv = document.getElementById('detailed-info');
    detailDiv.innerHTML = `<h2>${character.name}</h2>
        <p>ID: ${character.id}</p>
        <img src="${character.image}" alt="${character.name}" width="300px"/>
        <h4>Total Votes: <span id="vote-count">${character.votes}</span></h4>
        <form id="votes-form">
          <input type="text" placeholder="Enter Votes" value="" id="votes" name="votes" />
          <input type="submit" value="Add Votes" />
        </form>
        <button id="reset-btn">Reset Votes</button>;`
}
characterNames();
function addVoteFunctionality() {
    document.getElementById('detailed-info').addEventListener('submit', event => {
        event.preventDefault();
        const voteCountElement = document.getElementById('vote-count');
        const votesInput = document.getElementById('votes');
        const newVotes = parseInt(votesInput.value);
        if (!isNaN(newVotes)) {
            const currentVotes = parseInt(voteCountElement.innerText);
            voteCountElement.innerText = currentVotes + newVotes;
            patchCharacterVotes(characterId, currentVotes + newVotes);
        }
        votesInput.value = '';
    });

    document.getElementById('detailed-info').addEventListener('click', event => {
        if (event.target.id === 'reset-btn') {
            document.getElementById('vote-count').innerText = '0';
        }
    });
}
addVoteFunctionality();
function patchCharacterVotes(characterId, newVotes) {
    fetch(`http://localhost:3000/characters/${characterId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ votes: newVotes })})
    .then(res => res.json())
    .then(updatedCharacter => {console.log('Updated character:', updatedCharacter);})
    .catch(error => {console.error('Error updating character votes:', error);});
}


