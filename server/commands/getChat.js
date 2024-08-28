const fs = require('fs')
module.exports = function getChat(req, res) {
    fs.readFile('chat.json', 'utf8', (err, data) => {
        const joincode=req.headers.joincode
        const chat=JSON.parse(data)[joincode]
        res.end(JSON.stringify(chat))
    })
}