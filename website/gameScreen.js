document.getElementById('start-game').addEventListener('click',startGame);
let deck = [];  // Deck will be fetched from the server
let gameData = {};  // Game data will be fetched from the server

const currentUser = "user";  // The current player

// Fetch the deck from the server
async function fetchDeck() {
    try {
        const response = await fetch(`http://${serverip}/getDeck`);
        deck = await response.json();
    } catch (error) {
        console.error('Failed to fetch deck:', error);
    }
}

// Fetch the game state from the server every second
async function fetchGameState() {
    try {
        const response = await fetch(`http://${serverip}/gameState`,{headers:{joincode:joincode}});
        gameData = await response.json();
        renderGame();  // Render the game whenever the game state is updated
    } catch (error) {
        console.error('Failed to fetch game state:', error);
    }
}

// Render the game
function renderGame() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = '';  // Clear the game div

    for (const player in gameData.players) {
        const playerData = gameData.players[player];
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        
        const healthText = document.createElement('p');
        healthText.innerText = `${player}'s Health: ${playerData.health}`;
        playerDiv.appendChild(healthText);

        const handDiv = document.createElement('div');
        handDiv.classList.add('hand');

        playerData.hand.forEach(cardIndex => {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');

            // Show cards for the current user, show back for others
            const img = document.createElement('img');
            if (player === currentUser) {
                img.src = `http://${serverip}/cardImage/${deck[cardIndex].id}`;  // Use card ID to get the front image
                img.alt = deck[cardIndex].name;
                cardDiv.classList.add('my-hand');
            } else {
                img.src = `http://${serverip}/cardImage/back`;  // Use the back image for others
                img.alt = 'Card Back';
            }

            cardDiv.appendChild(img);

            // Add click event to zoom in on card
            cardDiv.addEventListener('click', () => openModal(img.src));

            handDiv.appendChild(cardDiv);
        });

        playerDiv.appendChild(handDiv);
        gameDiv.appendChild(playerDiv);
    }
}

// Open modal to zoom in on card
function openModal(imageSrc) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Close modal on pressing 'Esc' key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeModal();
    }
});
function startGame(){
    document.querySelector('.lobby-screen').style.display='none'
    document.querySelector('.game-screen').style.display='block'
    postWithFallbackNoJSON(`https://${serverip}/startGame`,{joincode:joincode})
    fetchDeck();
    //setInterval(fetchGameState, 1000);
    fetchGameState
}