const fs = require('fs');

module.exports = function lobbyState(req, res) {
    fs.readFile('gameLobbies.json', 'utf8', (err, data) => {
        if (err) {
            res.statusCode = 500;
            return res.end('Error reading game lobby data');
        }
        
        const joincode = req.headers.joincode;
        const parsedData = JSON.parse(data);

        if (!joincode || !parsedData[joincode]) {
            res.statusCode = 404;
            return res.end('lobby not found for the given joincode');
        }
        
        const lobby = parsedData[joincode];
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(lobby));
    });
};
