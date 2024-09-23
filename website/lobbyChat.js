document.getElementById('lobby-send-button').addEventListener('click', lobbySendMessage);
document.getElementById('lobby-message-input').addEventListener('keydown', lobbyHandleKeyPress);
var lobbyChatCooldown=1000;
var lobbyChatInterval=0;
function lobbyStartChat() {
    // Get the joincode and username from input fields
    joincode = document.getElementById('joincode-input').value;
    username = document.getElementById('username-input').value;

    // Start fetching chat messages periodically
    lobbyChatInterval=setInterval(lobbyFetchChatMessages, lobbyChatCooldown);
    lobbyFetchChatMessages();
}

function lobbySendMessage() {
    const input = document.getElementById('lobby-message-input');
    const message = input.value;

    if (message.trim() === "") return; // Prevent sending empty messages

    // Add the message to the chat box locally
    if(document.getElementById('lobby-chat-timestamps').checked){
        var now=new Date(Date.now())
        lobbyAddMessageToChatBox(`[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] ${username}: ${message}`, 'lobby-user-message')
    }
    else lobbyAddMessageToChatBox(`${username}: ${message}`, 'lobby-user-message');

    const headers = {
        'Content-Type': 'application/json',
        'joincode': joincode,  // Use dynamic joincode
        'username': username,  // Use dynamic username
        'text': message
    };
    // Send the message to the server with headers
    postWithFallback(`https://${serverip}/sendChat`, headers);

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

function lobbyFetchChatMessages() {
    const headers = { 'joincode': joincode }; // Add joincode header
    fetchWithFallback(`https://${serverip}/getChat`,headers)
        .then(data => {
            if (data && data.length > 0) {
                lobbyClearChatBox();
                data.forEach(message => {
                    if(document.getElementById('lobby-chat-timestamps').checked){
                        var time=new Date(message['time-sent'])
                        lobbyAddMessageToChatBox(`[${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}] ${message.sender}: ${message.text}`, 'lobby-server-message')
                    }
                    else lobbyAddMessageToChatBox(`${message.sender}: ${message.text}`, 'lobby-server-message');
                });
            } else {
                console.warn('No messages found for this joincode.');
            }
        })
        .catch(error => {
            console.error('Error fetching chat messages:', error);
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