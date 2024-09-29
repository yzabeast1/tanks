const fs=require('fs')
module.exports=function quitGame(req,res){
    const username=req.headers.username
    const joincode=req.headers.joincode
    fs.readFile('games.json','utf8',(err,data)=>{
        var games=JSON.parse(data)
        var game=games[joincode]
        delete game['players'][username]
        games[joincode]=game
        fs.writeFileSync('games.json',JSON.stringify(games, null, "\t"))
        res.end()
    })
}