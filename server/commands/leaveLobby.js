const fs=require('fs')
module.exports = function leaveLobby(req, res) {
    var username = req.headers.username;
    var joincode = req.headers.joincode;
    fs.readFile('gameLobbies.json', 'utf8', (err, data) => {
        var lobbies = JSON.parse(data)
        if (lobbies[joincode]) {
            if (lobbies[joincode].includes(username)) {
                lobbies[joincode].pop(username)
                res.send("left game lobby")
                fs.writeFile('gameLobbies.json', JSON.stringify(lobbies, null, "\t"), function (err) { if (err) console.log(err); });
            }
            else res.send("not in lobby")
        }
        else res.send('game does not exist')
    })
} // username, joincode