document.getElementById('lobby-send-button').addEventListener('click', lobbySendMessage);
document.getElementById('lobby-message-input').addEventListener('keydown', lobbyHandleKeyPress);
lobbyChatInterval=0;
function lobbyStartChat() {
    // Get the joincode and username from input fields
    joincode = document.getElementById('joincode-input').value;
    username = document.getElementById('username-input').value;

    if (joincode.trim() === '' || username.trim() === '') {
        alert('Please enter both a join code and username');
        return;
    }

    // Start fetching chat messages periodically
    lobbyChatInterval=setInterval(lobbyFetchChatMessages, 3000);
    lobbyFetchChatMessages();
}

function lobbySendMessage() {
    const input = document.getElementById('lobby-message-input');
    const message = input.value;

    if (message.trim() === "") return; // Prevent sending empty messages

    // Add the message to the chat box locally
    lobbyAddMessageToChatBox(`${username}: ${message}`, 'lobby-user-message');

    // Send the message to the server with headers
    lobbySendMessageWithFallback('https://127.0.0.1/sendChat', message);

    // Clear the input box after sending the message
    input.value = '';
}

// Handle "Enter" key press to send message
function lobbyHandleKeyPress(event) {
    if (event.key === 'Enter') {
        lobbySendMessage(); // Send the message when "Enter" is pressed
        event.preventDefault(); // Prevent the default behavior of the Enter key (e.g., new line)
    }
}

function lobbySendMessageWithFallback(url, message) {
    const headers = {
        'Content-Type': 'application/json',
        'joincode': joincode,  // Use dynamic joincode
        'username': username,  // Use dynamic username
        'text': message
    };

    // Try sending the message using HTTPS
    fetch(url, {
        method: 'POST',
        headers: headers
    })
        .then(response => {
            if (!response.ok) throw new Error('HTTPS failed'); // Handle HTTP errors
            return response.json();
        })
        .catch(error => {
            console.warn('HTTPS failed, falling back to HTTP:', error);
            // Retry with HTTP if HTTPS fails
            fetch(url.replace('https://', 'http://'), {
                method: 'POST',
                headers: headers
            })
                .then(response => {
                    if (!response.ok) throw new Error('HTTP failed');
                    return response.json();
                })
                .catch(httpError => {
                    console.error('Both HTTPS and HTTP failed:', httpError);
                });
        });
}

function lobbyFetchChatMessages() {
    fetchWithFallback('https://127.0.0.1/getChat')
        .then(data => {
            if (data && data.length > 0) {
                lobbyClearChatBox();
                data.forEach(message => {
                    lobbyAddMessageToChatBox(`${message.sender}: ${message.text}`, 'lobby-server-message');
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

// Helper function to append a message to the chat box
function lobbyAddMessageToChatBox(message, className) {
    const messageElement = document.createElement('div');
    messageElement.className = className;
    messageElement.innerText = message;

    const chatBox = document.getElementById('lobby-chat-box');
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function lobbyClearChatBox() {
    const chatBox = document.getElementById('lobby-chat-box');
    chatBox.innerHTML = ''; // Clear all messages
}