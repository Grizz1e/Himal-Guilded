const { Embed } = require('guilded.ts')
const { renderPlayerStats, resolveNewStats, fightMessage } = require('../../Utils/fightLogic')

module.exports = {
    name: 'fight',
    category: 'games',
    description: 'Mention any user and start a fight',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!message.mentions || !message.mentions.users) return message.reply('❌ No player mentioned!')
        let server = await client.servers.fetch(message.serverId)
        let player1 = message.author
        let player2 = await server.members.fetch(message.mentions.users[0].id)
        if (!player2) return message.reply('⚠️ No user found!')
        //if (player1.id === player2.id) return message.reply('❌ You cannot mention yourself')
        player1.score = player2.score = 0
        player1.hp = player2.hp = player1.stamina = player2.stamina = 100
        player1.punches = player2.punches = player1.kicks = player2.kicks = player1.heals = player2.heals = 0
        let embed = new Embed()
            .setColor('Red')
            .setTitle(`${player1.user.name} VS ${player2.user.name}`)
            .setDescription('')
            .addField(player1.user.name, renderPlayerStats(player1))
            .addField(player2.user.name, renderPlayerStats(player2))
            .addField('Type the following command in chat', `**punch** - To punch the opponent (Uses less stamina)\n**kick** - To kick the opponent (Uses more stamina)\n**heal** - To heal and increase HP and Stamina`)
            .setFooter(`${player1.user.name}'s Turn`)
        let botMsg = await message.reply({ embeds: [embed] })
        count = 1
        let descArr = []
        while (true) {
            let currentPlay = count % 2 === 1 ? player1 : player2
            let opponent = count % 2 === 1 ? player2 : player1

            let msg = await message.channel.awaitMessages({
                max: 1,
                time: 30_000,
                filter: (msg) => msg.authorId === currentPlay.id
            })
            if (!msg.first()) {
                return message.channel.send(`${currentPlay.user.name} got scared and ${fightMessage('flee')}`)
            }
            let choice = msg.first()
            if (choice.content === 'punch') {
                let newStats = resolveNewStats(count % 2 === 1 ? player1 : player2, count % 2 === 1 ? player2 : player1, 1)
                if (!newStats) {
                    descArr.push(`:warning: **${currentPlay.user.name}** tried to **PUNCH** but they missed`)
                } else {
                    descArr.push(`:boxing_glove: **${currentPlay.user.name}** ${fightMessage('punchKick')} a **PUNCH** to **${opponent.user.name}**`)
                    embed.fields[0].value = renderPlayerStats(count % 2 === 1 ? newStats.attacker : newStats.defender)
                    embed.fields[1].value = renderPlayerStats(count % 2 === 0 ? newStats.attacker : newStats.defender)
                }
            } else if (choice.content === 'kick') {
                let newStats = resolveNewStats(count % 2 === 1 ? player1 : player2, count % 2 === 1 ? player2 : player1, 2)
                if (!newStats) {
                    descArr.push(`:warning: **${currentPlay.user.name}** tried to **KICK** but they missed`)
                } else {
                    descArr.push(`:leg: ${currentPlay.user.name} ${fightMessage('punchKick')} a **KICK** to ${opponent.user.name}`)
                    embed.fields[0].value = renderPlayerStats(count % 2 === 1 ? newStats.attacker : newStats.defender)
                    embed.fields[1].value = renderPlayerStats(count % 2 === 0 ? newStats.attacker : newStats.defender)
                }
            } else if (choice.content === 'heal') {
                let newStats = resolveNewStats(count % 2 === 1 ? player1 : player2, count % 2 === 1 ? player2 : player1, 3)
                if (newStats.healed) descArr.push(`:mending_heart: ${currentPlay.user.name} **HEALED** themselves`)
                else descArr.push(`:warning: ${currentPlay.user.name} ran out of Healing Supplies so they took a rest`)
                embed.fields[0].value = renderPlayerStats(count % 2 === 1 ? newStats.attacker : newStats.defender)
                embed.fields[1].value = renderPlayerStats(count % 2 === 0 ? newStats.attacker : newStats.defender)

            } else {
                descArr.push(`:dizzy: ${currentPlay.user.name} was hit so hard that they got confused what to do`)
            }
            count++
            if (descArr.length > 4) {
                descArr.shift()
            }
            embed.setDescription(descArr.join('\n'))
                .setFooter(`${count % 2 === 1 ? player1.user.name : player2.user.name}'s Turn`)
                .setColor(count % 2 === 1 ? 'Red' : 'Blue')
            embed.fields[0].value = renderPlayerStats(player1)
            embed.fields[1].value = renderPlayerStats(player2)
            if (count === 5) {
                count = 1
                botMsg = await message.channel.send({ embeds: [embed] })
            } else {
                await botMsg.edit({ embeds: [embed] })
            }
            if (opponent.hp <= 0) {
                let newEmbed = new Embed()
                    .setDescription(`**:sports_medal: ${currentPlay.user.name} landed a critical hit and knocked out ${opponent.user.name}**`)
                    .setTitle(`:tada::tada: Congratulations ${currentPlay.user.name}, you're a pro fighter`)
                if (currentPlay.user.avatar && opponent.user.avatar) {
                    newEmbed.setImage(`https://vacefron.nl/api/batmanslap?text1=${encodeURIComponent(`Forgive me ${currentPlay.user.name}`)}&text2=Then+take+this+slap&batman=${currentPlay.user.avatar}&robin=${opponent.user.avatar}`)
                }
                return message.channel.send({ embeds: [newEmbed] })
            }

        }
    }
}