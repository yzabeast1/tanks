module.exports=function gameState(req,res){
    joinCode=req.headers.joincode
    fs.readFile('games.json','utf8',(err,data)=>{
        var games=JSON.parse(data)
        var game=games[joinCode]
        res.end(JSON.stringify(game))
    })
}