const fs=require('fs')
module.exports = function joinGame(req, res) {
    var username = req.headers.username;
    var joincode = req.headers.joincode;
    fs.readFile('gameLobbies.json', 'utf8', (err, data) => {
        var lobbies = JSON.parse(data);
        if (lobbies[joincode]) {
            if (!lobbies[joincode].includes(username)) {
                lobbies[joincode].push(username)
                res.send("joined game lobby")
                fs.writeFileSync('gameLobbies.json', JSON.stringify(lobbies, null, "\t"));
            }
            else res.send("no duplicate usernames allowed")
        }
        else res.send('game does not exist')
    })
} // username, joincode