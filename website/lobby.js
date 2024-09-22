document.getElementById('new-game').addEventListener('click', newGame);
document.getElementById('join-lobby').addEventListener('click', joinLobby);
document.getElementById('show-deck-checkbox').addEventListener('click', toggleDeck)
document.getElementById('leave-lobby').addEventListener('click', leaveLobby);
var playersInLobbyCooldown = 1000;
var lobbyPlayersInterval = 0
const serverip = '127.0.0.1'
function joinLobby() {
    document.querySelector('.menu-screen').style.display = 'none'
    document.querySelector('.lobby-screen').style.display = 'block'
    username = document.getElementById('username-input').value;
    joincode = document.getElementById('joincode-input').value;
    const headers = {
        'Content-Type': 'application/json',
        'username': username,
        'joincode': joincode
    };
    fetch(`https://${serverip}/joinGame`, {
        method: 'POST',
        headers: headers
    })
        .then(response => {
            if (!response.ok) throw new Error('HTTPS failed'); // Handle HTTP errors
            document.getElementById('lobby-show-code').innerHTML = "JoinCode: " + joincode
        })
        .catch(error => {
            console.warn('HTTPS failed, falling back to HTTP:', error);
            // Retry with HTTP if HTTPS fails
            fetch(`http://${serverip}/joinGame`, {
                method: 'POST',
                headers: headers
            })
                .then(response => {
                    if (!response.ok) throw new Error('HTTP failed');
                    document.getElementById('lobby-show-code').innerHTML = "JoinCode: " + joincode
                })
                .catch(httpError => {
                    console.error('Both HTTPS and HTTP failed:', httpError);
                });
        });
    lobbyPlayersInterval = setInterval(lobbyPlayers, playersInLobbyCooldown);
    lobbyPlayers();
    lobbyStartChat();
}
function newGame() {
    document.querySelector('.menu-screen').style.display = 'none'
    document.querySelector('.lobby-screen').style.display = 'block'
    username = document.getElementById('username-input').value;
    const headers = {
        'Content-Type': 'application/json',
        'username': username
    };

    // Try sending the message using HTTPS
    fetch(`https://${serverip}/createGame`, {
        method: 'POST',
        headers: headers
    })
        .then(response => {
            if (!response.ok) throw new Error('HTTPS failed'); // Handle HTTP errors
            joincode = response.headers.get('joincode')
            document.getElementById('joincode-input').value = joincode
            document.getElementById('lobby-show-code').innerHTML = "JoinCode: " + document.getElementById('joincode-input').value
        })
        .catch(error => {
            console.warn('HTTPS failed, falling back to HTTP:', error);
            // Retry with HTTP if HTTPS fails
            fetch(`http://${serverip}/createGame`, {
                method: 'POST',
                headers: headers
            })
                .then(response => {
                    if (!response.ok) throw new Error('HTTP failed');
                    console.log(response.headers.get('joincode'));
                    joincode = response.headers.get('joincode')
                    document.getElementById('joincode-input').value = joincode
                    document.getElementById('lobby-show-code').innerHTML = "JoinCode: " + document.getElementById('joincode-input').value
                })
                .catch(httpError => {
                    console.error('Both HTTPS and HTTP failed:', httpError);
                });
        });
    lobbyPlayersInterval = setInterval(lobbyPlayers, playersInLobbyCooldown);
    addLobbyPlayer(username, 'server-messsage')
    lobbyPlayers();
    lobbyStartChat();
}
function lobbyPlayers() {
    const headers = { 'joincode': joincode }; // Add joincode header
    fetchWithFallback(`https://${serverip}/lobbyState`, headers)
        .then(data => {
            if (data && data.length > 0) {
                clearLobbyPlayers();
                data.forEach(player => {
                    addLobbyPlayer(player, 'server-message');
                });
            } else {
                console.warn('No messages found for this joincode.');
            }
        })
        .catch(error => {
            console.error('Error fetching lobby players:', error);
        });
}
function clearLobbyPlayers() {
    const players = document.getElementById('lobby-players');
    players.innerHTML = ''; // Clear all messages
}
function addLobbyPlayer(player, className) {
    const messageElement = document.createElement('div');
    messageElement.className = className;
    messageElement.innerText = player;

    const playerList = document.getElementById('lobby-players');
    playerList.appendChild(messageElement);
}
function leaveLobby() {
    username = document.getElementById('username-input').value;
    joincode = document.getElementById('joincode-input').value;
    const headers = {
        'Content-Type': 'application/json',
        'username': username,
        'joincode': joincode
    };
    fetch(`https://${serverip}/leaveLobby`, {
        method: 'POST',
        headers: headers
    })
        .then(response => {
            if (!response.ok) throw new Error('HTTPS failed'); // Handle HTTP errors
            else {
                document.querySelector('.menu-screen').style.display = 'block'
                document.querySelector('.lobby-screen').style.display = 'none'
                document.getElementById('joincode-input').value = ''
                clearInterval(lobbyPlayersInterval)
            }
        })
        .catch(error => {
            console.warn('HTTPS failed, falling back to HTTP:', error);
            // Retry with HTTP if HTTPS fails
            fetch(`http://${serverip}/leaveLobby`, {
                method: 'POST',
                headers: headers
            })
                .then(response => {
                    if (!response.ok) throw new Error('HTTP failed');
                    else {
                        document.querySelector('.menu-screen').style.display = 'block'
                        document.querySelector('.lobby-screen').style.display = 'none'
                        document.getElementById('joincode-input').value = ''
                        clearInterval(lobbyPlayersInterval)
                    }
                })
                .catch(httpError => {
                    console.error('Both HTTPS and HTTP failed:', httpError);
                });
        });
}
function toggleDeck() {
    var deck = document.getElementById('show-deck')
    if (deck.style.display == 'block') deck.style.display = 'none'
    else deck.style.display = 'block'
}
window.onload = createDeck
function createDeck() {
    const deckDiv = document.getElementById('show-deck');
    fetchWithFallback("https://" + serverip + "/getDeck").then(deck => {
        deck.forEach(card => {
            // Create an image element
            const img = document.createElement('img');
            img.src = "http://" + serverip + "/cardImage/" + card['id']; // Set the image source to the card's image location
            img.alt = card.name; // Set the alt text to the card's name
            img.style.width = '150px'; // Optional: set the image size
            img.style.margin = '10px'; // Optional: add some margin between images

            // Append the image to the deckDiv
            deckDiv.appendChild(img);
        });
    })
}
function addCardToDeck() {
    const image = document.createElement('image')
    image.className = "deck-image"
    const deck = document.getElementById('show-deck')
    deck.appendChild(image)
}