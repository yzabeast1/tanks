module.exports=function(games,code,target){
    if(games[code]['players'][target]['health']<=0)
        delete games[code]['players'][target]
    return games
}