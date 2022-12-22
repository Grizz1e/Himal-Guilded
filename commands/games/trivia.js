const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const he = require('he')
const { shuffleArray, delay } = require('../../Utils/functions')

module.exports = {
    name: 'trivia',
    category: 'games',
    description: '10 questions, 5 rounds, random difficulty. Do you have what it takes to be the most intelligent person?',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!message.mentions || !message.mentions.users) return message.reply('❌ No player mentioned!')
        let server = await client.servers.fetch(message.serverId)
        let player1 = await server.members.fetch(message.authorId)
        let player2 = await server.members.fetch(message.mentions.users[0].id)
        if (!player2) return message.reply('⚠️ No user found!')
        if (player1.id === player2.id) return message.reply('❌ You cannot mention yourself')
        player1.score = player2.score = 0
        fetch('https://opentdb.com/api.php?amount=10&type=multiple').then(async (response) => {
            let res = await response.json()
            let questions = res.results
            let i, currentPlay;
            for (i = 0; i < questions.length; i++) {
                i % 2 === 0 ? currentPlay = player1 : currentPlay = player2
                let title = he.decode(res.results[i].question)
                let correct = he.decode(res.results[i].correct_answer)
                let incorrects = res.results[i].incorrect_answers
                let options = [correct, ...incorrects]
                let shuffledOptions = shuffleArray(options)
                let desc = shuffledOptions.map((x, i) => `${i + 1}) ${he.decode(x)}`).join('\n')
                let embed = new Embed()
                    .setColor(i % 2 === 0 ? 'RED' : 'BLUE')
                    .setTitle(`<@${currentPlay.id}>, ${title}`)
                    .setDescription(`${desc}\n\n${player1.username}: ${player1.score}/${(i / 2).toFixed()}\n${player2.username}: ${player2.score}/${i === 0 ? 0 : Math.ceil((i - 1) / 2)}`)
                    .setFooter(`${currentPlay.username}'s turn!`)
                await message.reply(embed)
                let msg = await client.messages.awaitMessages(message.channelId, {
                    max: 1,
                    timeLimit: 20_000,
                    filter: (msg) => msg.authorId === currentPlay.id
                })
                if (!msg.entries.entries().next().value) {
                    embed.setTitle('⏱️ Time up!')
                        .setDescription()
                        .setColor()
                        .setFooter()
                    await message.send({ embeds: [embed] })
                    await delay(2000)
                    continue
                }
                let usrMsg = msg.entries.entries().next().value[1]

                let choice = parseInt(usrMsg.content)
                if (isNaN(choice) || choice < 1 || choice > 4) {
                    await usrMsg.reply('❌ Invalid option, try again')
                } else if (he.decode(shuffledOptions[choice - 1]) === correct) {
                    currentPlay.score++
                    await usrMsg.reply('🎉 Congratulations, you got it right')
                } else {
                    await usrMsg.reply(`❌ You got it wrong, correct answer was \`${correct}\``)
                }
                await delay(2000)
                if (i === 9) {
                    let scorecard = `\n${player1.username}: ${player1.score}/5\n${player2.username}: ${player2.score}/5`
                    if (player1.score !== player2.score) {
                        embed.setTitle(`🎉🎉 ${player1.score > player2.score ? player1.username : player2.username} won!`)
                            .setDescription(scorecard)
                            .setColor('GREEN')
                            .setFooter()
                        message.send({ embeds: [embed] })
                    } else {
                        embed.setTitle(`🙀🙀It's a draw!`)
                            .setDescription(scorecard)
                            .setColor()
                            .setFooter()
                        message.send({ embeds: [embed] })
                    }
                }
            }
        })
    }
}