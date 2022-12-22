const { Embed } = require('guilded.ts/dist/index.js')
const { checkRps } = require('../../Utils/functions.js')
const { prefix } = require('../../config.json').bot

module.exports = {
    name: 'rps',
    category: 'games',
    description: 'Play a game of Rock Paper Scissors with me',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!message.mentions || !message.mentions.users) return message.reply('❌ You did not mention any user')
        let server = await client.servers.fetch(message.serverId)
        let player1 = await server.members.fetch(message.authorId)
        let player2 = await server.members.fetch(message.mentions.users[0].id)
        if (!player2) return message.reply('⚠️ Could not find the mentioned user')
		if (player1.id === player2.id) return message.reply('❌ You cannot mention yourself')
        
        let embed = new Embed()
            .setTitle(`<@${message.mentions.users[0].id}>, you have been challenged to play Rock, Paper, Scissors by <@${message.authorId}>`)
            .setDescription(`Type \`${prefix}join rps\` in the chat if you accept this challenge`)
        let botMsg = await message.reply({ embeds: [embed] })
        let usrRes = await message.channel.awaitMessages({
            max: 1,
            time: 30_000,
            filter: (msg) => msg.authorId === message.mentions.users[0].id && msg.content === `${prefix}join rps`
        })
        if (!usrRes.first()) {
            embed.setTitle(':warning: User did not reply within 30 seconds')
                .setDescription()
            return message.channel.send({ embeds: [embed] })
        } else {
            embed.setTitle(`<@${player2.id}> accepted the challenge`)
                .setDescription(`:x: <@${player1.id}> is yet to decide\n:x: <@${player2.id}> is yet to decide`)
            await botMsg.edit({ embeds: [embed] })
            let usrMsg = usrRes.first()
            let messages = [message, usrMsg]
            let emojis = [
                90003217,
                90001953,
                90002009
            ]
            let playerChoices = {
                player1: null,
                player2: null
            }
            let reactionMap = {
                90003217: 'rock',
                90001953: 'paper',
                90002009: 'scissors'
            }
            messages.forEach(async msg => {
                embed.setTitle('React with the emoji to select your pick')
                    .setDescription(`Rock - :rock:\nPaper - :page_facing_up:\nScissors - :scissors:`)
                let botChoiceEmbed
                await msg.reply({ embeds: [embed], isPrivate: true }).then(async (mesg) => {
                    botChoiceEmbed = mesg
                    await mesg.react(90003217)
                    await mesg.react(90001953)
                    await mesg.react(90002009)
                })
                let usrChoice = await botChoiceEmbed.awaitReactions({
                    max: 1,
                    time: 30_000,
                    filter: (reaction) => emojis.includes(reaction.id)
                })
                if (!usrChoice.first()) return message.channel.send('⚠️ At least one player did not pick their choice')
                else {
                    if (msg.authorId === message.authorId) playerChoices.player1 = reactionMap[usrChoice.first().id]
                    else playerChoices.player2 = reactionMap[usrChoice.first().id]

                    embed.setTitle(`<@${player2.id}> accepted the challenge`)
                        .setDescription(`${playerChoices.player1 ? `:white_check_mark: <@${player1.id}> made their choice` : `:x: <@${player1.id}> is yet to decide`}\n${playerChoices.player2 ? `:white_check_mark: <@${player2.id}> made their choice` : `:x: <@${player2.id}> is yet to decide`}`)
                    await botMsg.edit({ embeds: [embed] })
                    if (playerChoices.player1 && playerChoices.player2) {
                        let result = checkRps(playerChoices.player1, playerChoices.player2)
                        if (result === 2) {
                            embed.setTitle('It is a draw')
                        } else if (result === 0) {
                            embed.setTitle(`<@${player2.id}> won the challenge`)
                        } else {
                            embed.setTitle(`<@${player1.id}> won the challenge`)
                        }
                        embed.setDescription(`:white_check_mark: <@${player1.id}> picked ${playerChoices.player1}\n:white_check_mark: <@${player2.id}> picked ${playerChoices.player2}\n`)
                        message.channel.send({ embeds: [embed] })
                    }
                }
            })

        }
    }
}