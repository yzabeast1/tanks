const fs=require('fs')
module.exports=function quitGame(req,res){
    const username=req.headers.username
    const joincode=req.headers.joincode
    fs.readFile('games.json','utf8',(err,data)=>{
        var games=JSON.parse(data)
        var game=games[joincode]
        delete game['players'][username]
        console.log(game)
        games[joincode]=game
        fs.writeFile('games.json',JSON.stringify(games, null, "\t"), function (err) { if (err) console.log(err) })
    })
}