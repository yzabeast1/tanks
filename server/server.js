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
const httpsPort = 443;
const httpPort = 80;

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
    httpsApp.get('/cardInfo', (req, res) => { cardInfo(req, res) });
    httpsApp.post('/playCard', (req, res) => { playCard(req, res) });
    httpsApp.post('/joinGame', (req, res) => { joinGame(req, res) });
    httpsApp.post('/createGame', (req, res) => { createGame(req, res) });
    httpsApp.post('/quitGame', (req, res) => { quitGame(req, res) });
    httpsApp.post('/startGame', (req, res) => { startGame(req, res) });
    httpsApp.get('/checkGameStarted', (req, res) => { checkGameStarted(req, res) });
    httpsApp.get('/getChat', (req, res) => { getChat(req, res) })
    httpsApp.post('/sendChat', (req, res) => { sendChat(req, res) })
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
httpApp.get('/cardInfo', (req, res) => { cardInfo(req, res) });
httpApp.post('/playCard', (req, res) => { playCard(req, res) });
httpApp.post('/joinGame', (req, res) => { joinGame(req, res) });
httpApp.post('/createGame', (req, res) => { createGame(req, res) });
httpApp.post('/quitGame', (req, res) => { quitGame(req, res) });
httpApp.post('/startGame', (req, res) => { startGame(req, res) });
httpApp.get('/checkGameStarted', (req, res) => { checkGameStarted(req, res) });
httpApp.get('/gameState', (req, res) => { gameState(req, res) })
httpApp.get('/getChat', (req, res) => { getChat(req, res) })
httpApp.post('/sendChat', (req, res) => { sendChat(req, res) })

const endTurn = require("./commands/endTurn.js")//username, joincode
const cardInfo=require("./commands/cardInfo.js") // card id
const playCard=require("./commands/playcard.js") // username, joincode, target, card
const joinGame = require("./commands/joinGame.js")//username, joincode
const createGame = require("./commands/createGame.js") // username
const quitGame = require("./commands/quitGame.js")//username, joincode
const checkGameStarted = require("./commands/checkGameStarted.js");//joincode
const startGame = require("./commands/startGame.js")//joincode
const gameState = require("./commands/gameState.js")//joincode
const getChat = require("./commands/getChat.js")//joincode
const sendChat=require("./commands/sendChat.js")//joincode, username