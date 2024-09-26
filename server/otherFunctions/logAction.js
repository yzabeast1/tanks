const fs = require('fs')
module.exports = function logAction(text, joincode) {
    const chat = JSON.parse(fs.readFileSync('chat.json', 'utf8'))
    var action = JSON.parse(`{
        "sender":"server",
        "time-sent":${Math.floor(new Date().getTime() / 1000)},
        "text":"${text}"
    }`)
    chat[joincode].push(action)
    fs.writeFile('chat.json', JSON.stringify(chat, null, "\t"), function (err) { if (err) console.log(err) })
}