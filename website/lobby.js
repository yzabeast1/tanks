document.getElementById('new-game').addEventListener('click',newGame);

const serverip="127.0.0.1"


function newGame(){
    document.querySelector('.menu-screen').style.display='none'
    document.querySelector('.lobby-screen').style.display='flex'
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
        console.log(response.headers.get('joincode'));
        joincode=response.headers.get('joincode')
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
        joincode=response.headers.get('joincode')
        })
        .catch(httpError => {
            console.error('Both HTTPS and HTTP failed:', httpError);
        });
    });
    setInterval(lobbyPlayers, 3000);
    lobbyPlayers();
}
function lobbyPlayers(){
    fetchWithFallback('https://127.0.0.1/lobbyState')
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
        console.error('Error fetching chat messages:', error);
    });
}
function fetchWithFallback(url) {
    const headers = { 'joincode': joincode }; // Add joincode header

    return fetch(url, { headers })
        .then(response => {
            if (!response.ok) throw new Error('HTTPS failed');
            return response.json();
        })
        .catch(error => {
            console.warn('HTTPS failed, falling back to HTTP:', error);
            // Retry with HTTP if HTTPS fails
            return fetch(url.replace('https://', 'http://'), { headers })
                .then(response => {
                    if (!response.ok) throw new Error('HTTP failed');
                    return response.json();
                });
        });
}
function clearLobbyPlayers() {
    const players = document.getElementById('lobby-players');
    players.innerHTML = ''; // Clear all messages
}
function addLobbyPlayer(player,className) {
    const messageElement = document.createElement('div');
    messageElement.className = className;
    messageElement.innerText = player;

    const playerList = document.getElementById('lobby-players');
    playerList.appendChild(messageElement);
}