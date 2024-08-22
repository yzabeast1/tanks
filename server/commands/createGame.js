const fs=require('fs')
module.exports=function createGame(req,res){
    const username=req.headers.username
    const joincode=createGameID(6)
    const users=[username]
    fs.readFile('gameLobbies.json','utf8',(err,data)=>{
        var lobbies=JSON.parse(data)
        lobbies[joincode]=users
        console.log(lobbies)
        fs.writeFile('gameLobbies.json',JSON.stringify(lobbies, null, "\t"), function (err) { if (err) console.log(err) })
    })
}
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
