const fs = require('fs')
module.exports = function createGame(req, res) {
    const username = req.headers.username
    const joincode = createGameID(6)
    const users = [username]
    fs.readFile('gameLobbies.json', 'utf8', (err, data) => {
        var lobbies = JSON.parse(data)
        lobbies[joincode] = users
        fs.writeFileSync('gameLobbies.json', JSON.stringify(lobbies, null, "\t"))
        res.setHeader('Access-Control-Expose-Headers', 'joincode');
        res.setHeader('joincode', joincode)
        res.setHeader('Content-Type', 'text/plain');
        res.end(joincode);
    })
}
function createGameID(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
