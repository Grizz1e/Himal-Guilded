const { Embed } = require("guilded.ts")
const { tttRenderer, tttArrayManager, tttWinCheck } = require('../../Utils/tttLogic.js')

module.exports = {
    name: 'tictactoe',
    category: 'games',
    description: 'Play a game of Tic-Tac-Toe. Put three same symbols horizontally, vertically or diagonally and win',
    args: ['userMention'],
    aliases: ['ttt'],
    run: async (client, message, args) => {
        if (!message.mentions || !message.mentions.users) return message.reply('❌ No player mentioned!')
        let server = await client.servers.fetch(message.serverId)
        let player1 = await server.members.fetch(message.authorId)
        let player2 = await server.members.fetch(message.mentions.users[0].id)
        if (!player2) return message.reply('⚠️ No user found!')
        if (player1.id === player2.id) return message.reply('❌ You cannot mention yourself')
        let boxArr = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]
        let tttTxt = tttRenderer(boxArr)
        let embed = new Embed()
            .setColor('Red')
            .setTitle(`${player1.user.name} VS ${player2.user.name}`)
            .setDescription(tttTxt)
            .setFooter(`${player1.user.name}'s Turn`)
        let botMsg = await message.reply({ embeds: [embed] })
        let count = 1
        while (true) {
            let sym = count % 2 === 1 ? 1 : 2
            let currentPlay = sym === 1 ? player1 : player2
            let msg = await message.channel.awaitMessages({
                max: 1,
                time: 30_000,
                filter: (msg) => msg.authorId === currentPlay.id
            })
            if (!msg.first()) return message.channel.send('⏱️ Time up!')
            let usrMsg = msg.first()

            let choice = usrMsg.content
            let newBoxArr = await tttArrayManager(boxArr, choice, sym)
            if (!newBoxArr) usrMsg.reply('❌ Invalid choice!')
            else {
                count++
                tttTxt = tttRenderer(newBoxArr)
                embed.setDescription(tttTxt)
                    .setFooter(`${sym === 1 ? player2.user.name : player1.user.name}'s Turn`)
                    .setColor(sym === 1 ? 'Blue' : 'Red')
                let won = tttWinCheck(newBoxArr)
                if (won === 'draw') {
                    embed.setAuthor('Nobody won, nobody lost')
                        .setTitle(`It ended in a draw 😐`)
                        .setColor()
                        .setFooter()
                    return message.channel.send({ embeds: [embed] })
                } else if (won) {
                    let winner = currentPlay
                    embed.setAuthor(`Congratulations ${winner.user.name}!`, winner.user.avatar)
                        .setTitle(`<@${winner.id}> won!🎉🎉🎉🎉`)
                        .setColor('Green')
                        .setFooter()
                    return message.channel.send({ embeds: [embed] })

                } else {
                    if (count === 7) {
                        count = 1
                        botMsg = await message.channel.send({ embeds: [embed] })
                    } else {
                        botMsg.edit({ embeds: [embed] })
                    }
                }
            }
        }

    }
}