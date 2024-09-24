const fs = require('fs')
module.exports = function sendChat(req, res) {
    fs.readFile('chat.json', 'utf8', (err, data) => {
        var chat=JSON.parse(data)
        if(!chat[req.headers.joincode])chat[req.headers.joincode]=[]
        var gamechat=chat[req.headers.joincode]
        var text=req.headers.text
        text=text.replace('"','')
        text=text.replace('\\','')
        gamechat.push(JSON.parse(`{"sender":"${req.headers.username}","time-sent":${Math.floor(new Date().getTime() / 1000)},"text":"${text}"}`))
        chat[req.headers.joincode]=gamechat
        fs.writeFile('chat.json',JSON.stringify(chat, null, "\t"), function (err) { if (err) console.log(err) })
        res.end()
    })
}