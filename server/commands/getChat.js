const fs = require('fs');

module.exports = function getChat(req, res) {
    fs.readFile('chat.json', 'utf8', (err, data) => {
        if (err) {
            res.statusCode = 500;
            return res.end('Error reading chat data');
        }
        
        const joincode = req.headers.joincode;
        const parsedData = JSON.parse(data);

        if (!joincode || !parsedData[joincode]) {
            res.statusCode = 404;
            return res.end('Chat not found for the given joincode');
        }
        
        const chat = parsedData[joincode];
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(chat));
    });
};
