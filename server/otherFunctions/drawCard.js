const fs = require('fs')
module.exports = function drawCard(games, game, target, number) {
    if (!number) number = 1
    if (games[game]['draw_pile'].length >= number) {
        for (var i = 0; i < number; i++) {
            games[game]['players'][target]['hand'].push(games[game]['draw_pile'][i])
        }
        games[game]['draw_pile'].splice(0, number)
        console.log(games)
        return games
    }
    else {
        fs.readFile('deck.json', 'utf8', (err, data) => {
            const deckSize = JSON.parse(data).length
            let drawPile = new Set(games[game]['draw_pile']);
            let playerCards = new Set();

            // Iterate over all players' hands
            for (const player in games[game]['players']) {
                const hand = games[game]['players'][player].hand;
                hand.forEach(card => playerCards.add(card));
            }

            // Now create an array of numbers from 0 to decksize that are not in the drawPile or playerCards
            const missingCards = [];

            for (let i = 0; i < deckSize; i++) {
                if (!drawPile.has(i) && !playerCards.has(i)) {
                    missingCards.push(i);
                }
            }
            games[game]['draw_pile']=games[game]['draw_pile'].concat(shuffle(missingCards))
            console.log(games)
            drawCard(games,game,target,number)
        })
    }
}

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array
}