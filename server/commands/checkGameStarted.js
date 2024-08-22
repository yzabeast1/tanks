const fs=require('fs')
module.exports=function checkGameStarted(req, res) {
    const joincode = req.headers.joincode;

    fs.readFile('games.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send("no");
            return;
        }

        const games = JSON.parse(data || "{}");

        if (games[joincode]) {
            res.send("yes");
        } else {
            res.send("no");
        }
    });
} // joincode