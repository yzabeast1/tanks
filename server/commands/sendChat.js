const fs = require('fs')
module.exports = function sendChat(req, res) {
    fs.readFile('chat.json', 'utf8', (err, data) => {
        var chat=JSON.parse(data)
        if(!chat[req.headers.joincode])chat[req.headers.joincode]=[]
        var gamechat=chat[req.headers.joincode]
        console.log(gamechat)
        console.log(chat)
        gamechat.push(JSON.parse(`{"sender":"${req.headers.username}","time-sent":${Math.floor(new Date().getTime() / 1000)},"text":"${req.headers.text}"}`))
        chat[req.headers.joincode]=gamechat
        console.log(chat)
        fs.writeFile('chat.json',JSON.stringify(chat, null, "\t"), function (err) { if (err) console.log(err) })
    })
}