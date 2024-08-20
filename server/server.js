const { execSync } = require('child_process');
const requiredPackages = [
    'express',
    'body-parser',
    'fs',
    'path',
    'cors',
    'https'
];

function checkAndInstallPackages(packages) {
    packages.forEach(pkg => {
        try {
            require.resolve(pkg);
            console.log(`${pkg} is already installed.`);
        } catch (e) {
            console.log(`${pkg} is not installed. Installing...`);
            execSync(`npm install ${pkg}`, { stdio: 'inherit' });
        }
    });
}
checkAndInstallPackages(requiredPackages);

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const https = require('https');
const httpsPort = 3002;
const httpPort = 3003;

try {
    const privateKey = fs.readFileSync('private.key', 'utf8');
    const certificate = fs.readFileSync('certificate.crt', 'utf8');
    const ca = fs.readFileSync('ca_bundle.crt', 'utf8');
    const credentials = { key: privateKey, cert: certificate, ca: ca };
    const httpsApp = express();
    const httpsServer = https.createServer(credentials, httpsApp);
    httpsServer.listen(httpsPort, () => {
        console.log(`Https server is running at https://localhost:${httpsPort}`);
    });
    httpsApp.use(cors());
    httpsApp.use(bodyParser.json());

    httpsApp.post('/endTurn', (req, res) => { endTurn(req, res) });
    httpsApp.post('/playCard', (req, res) => { playCard(req, res) });
    httpsApp.get('/cardInfo', (req, res) => { cardInfo(req, res) });
    httpsApp.post('/joinGame', (req, res) => { joinGame(req, res) });
    httpsApp.post('/createGame', (req, res) => { createGame(req, res) });
    httpsApp.post('/quitGame', (req, res) => { quitGame(req, res) });
    httpsApp.post('/startGame', (req, res) => { startGame(req, res) });
    httpsApp.get('/checkGameStarted', (req, res) => { checkGameStarted(req, res) });
}
catch (e) {
    console.log(`Error with HTTPS\n ${e}`);
}

const httpApp = express();

httpApp.use(cors());
httpApp.use(bodyParser.json());

httpApp.listen(httpPort, () => {
    console.log(`Http server is running at http://localhost:${httpPort}`);
});


httpApp.post('/endTurn', (req, res) => { endTurn(req, res) });
httpApp.post('/playCard', (req, res) => { playCard(req, res) });
httpApp.get('/cardInfo', (req, res) => { cardInfo(req, res) });
httpApp.post('/joinGame', (req, res) => { joinGame(req, res) });
httpApp.post('/createGame', (req, res) => { createGame(req, res) });
httpApp.post('/quitGame', (req, res) => { quitGame(req, res) });
httpApp.post('/startGame', (req, res) => { startGame(req, res) });
httpApp.get('/checkGameStarted', (req, res) => { checkGameStarted(req, res) });

function endTurn(req, res) { console.log(1); } // username
function playCard(req, res) { console.log(2); } // username or id, target
function cardInfo(req, res) { console.log(3); } // card name or id
function joinGame(req, res) { console.log(req.headers); } // username, joincode
function createGame(req, res) { } // username
function quitGame(req, res) { console.log(6); } // username
function checkGameStarted(req, res) { 
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

function startGame(req, res) {
    fs.readFile('games.json', 'utf8', (err, data) => {
        fs.readFile('gameLobbies.json', 'utf8', (err1, data1) => {
            var lobbies = JSON.parse(data1);
            if (data == null) data = "{}";
            if (data == "") data = "{}";
            var games = JSON.parse(data);
            var game = req.headers.joincode;
            var players = lobbies[game];
            var newGame = JSON.parse(`{
                "turn":0,
                "shot_count":1,
                "event_count":1,
                "shooting_allowed":true,
                "no_shooting_player":"0",
                "order":["${players.join('","')}"],
                "players":{}
            }`);
            for (var i = 0; i < players.length; i++) {
                var makePlayer = JSON.parse(`{
                    "health":10,
                    "hand":[],
                    "queued_cards":[]
                }`);
                newGame['players'][players[i]] = makePlayer;
            }
            games[game] = newGame;
            fs.writeFile('games.json', JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err); });
            console.log(`A new game has been started with ${players}`);
            delete lobbies[game];
            console.log(lobbies);
            // fs.writeFile('gameLobbies,json',JSON.stringify(lobbies,null,"\t"),function(err){if(err)console.log(err)})
            res.status(200).send('Game Started');
        });
    });
} // joincode

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
