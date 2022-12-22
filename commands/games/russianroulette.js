const { Embed } = require("guilded.ts")
const { delay, shuffleArray } = require('../../Utils/functions.js')

module.exports = {
    name: 'russianroulette',
    category: 'games',
    description: 'Starts a game of russian roulette, loser gets kicked from the server',
    noArgs: true,
    args: ['punishment'],
    aliases: ['rr'],
    run: async (client, message, args) => {
        let punishment
        if (!args[0]) punishment = 0
        else if (args[0] === 'kick') punishment = 1
        else if (args[0] === 'ban') punishment = 2
        else punishment = 0
        let playerArr = [message.authorId]
        let server = await client.servers.fetch(message.serverId)
        let embed = new Embed()
            .setTitle('A new game of Russian Roulette is starting soon!')
            .setDescription(`Use command \`/join rr\` to join the game\n\n(You will NOT get join confirmation)\n\n${punishment > 0 ? `***⚠️⚠️IMPORTANT NOTE: If you LOSE, you\'ll be ${punishment === 1 ? 'KICKED' : 'BANNED'} from the server***` : `***Fun Fact:*** *You can use 'kick' or 'ban' as an optional argument to add them as a punishment*`}`)
            .setFooter('If no one joins within 30 seconds, the game will stop')
        await message.channel.send({ embeds: [embed] })
        let msg = await message.channel.awaitMessages({
            max: 8,
            time: 30_000,
            filter: (mssg) => mssg.authorId !== client.userId && mssg.content === "/join rr"
        })
        msg.forEach(el => {
            if (!playerArr.includes(el.authorId)) {
                playerArr.push(el.authorId)
            }
        });
        if (playerArr.length === 1) return message.reply('❌ Not enough players to start the game')
        else {
            embed.setTitle(`Total players: ${playerArr.length}`)
                .setDescription(`<@${playerArr.join('>, <@')}>`)
                .setFooter()
            message.channel.send({ embeds: [embed] })
        }
        embed.setDescription()
        playerArr = shuffleArray(playerArr)
        let round = 1, bullets = 1
        let i = 0
        await delay(4_000)
        embed.setTitle('Round 1 begins with 1 bullet')
        await message.channel.send({ embeds: [embed] })
        while (playerArr.length > 1) {
            if (bullets === 0) {
                await delay(4_000)
                embed.setTitle(`No bullets left, adding an extra bullet`)
                    .setColor()
                await message.channel.send({ embeds: [embed] })
                bullets++
            }
            if (i + 1 > playerArr.length) {
                round++
                bullets++
                i = 0
                await delay(4_000)
                embed.setTitle(`Round ${round} begins with ${bullets} bullets`)
                    .setColor()
                await message.channel.send({ embeds: [embed] })
            }
            await delay(4_000)
            embed.setTitle(`<@${playerArr[i]}> spins the trigger`)
                .setColor()
            message.channel.send({ embeds: [embed] })
            await delay(4_000)
            if (Math.floor(Math.random() * (7 - bullets)) === 0) {
                embed.setTitle(`:boom: *BANG* <@${playerArr[i]}> died`)
                    .setColor('Red')
                await message.channel.send({ embeds: [embed] })
                if (punishment > 0) {
                    try {
                        punishment === 1 ? await server.members.kick(playerArr[i]) : await server.members.ban(playerArr[i])
                    } catch (err) {
                        embed.setTitle(`⚠️ Could not ${punishment === 1 ? 'kick' : 'ban'} the user`)
                            .setColor()
                        message.channel.send({ embeds: [embed] })
                    }
                }
                bullets--

                playerArr = playerArr.filter(item => item !== playerArr[i])
            } else {
                embed.setTitle(`*Click* <@${playerArr[i]}> survived the round`)
                    .setColor('Green')
                message.channel.send({ embeds: [embed] })
            }
            i++
        }
        await delay(3_000)
        embed.setTitle(`:tada::tada: Congratulations <@${playerArr[0]}>, you won the game`)
            .setColor()
        punishment > 0 ? embed.setDescription(`Losers have been ${punishment === 1 ? 'KICKED' : 'BANNED'} from the server`) : ''
        message.channel.send({ embeds: [embed] })
    }
}