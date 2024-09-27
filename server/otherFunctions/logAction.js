const fs = require('fs');

module.exports = function logAction(text, joincode) {
    var chat = fs.readFileSync('chat.json', 'utf8');
    chat=JSON.parse(chat)

    // Directly construct the action object
    const action = {
        sender: "server",
        "time-sent": Math.floor(new Date().getTime() / 1000),
        text: text
    };

    // Check if joincode exists in chat
    if (!chat[joincode]) {
        chat[joincode] = [];
    }

    // Push the new action to the correct chat array
    chat[joincode].push(action);

    // Write the updated chat object back to chat.json
    fs.writeFile('chat.json', JSON.stringify(chat, null, "\t"), function (err) {
        if (err) console.log(err);
    });
};
