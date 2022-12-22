const { Embed } = require('guilded.ts/dist/index.js')
const { Aki } = require('aki-api')
const { serverId } = require('../../config.json').bot

module.exports = {
    name: 'akinator',
    category: 'games',
    description: 'Guess any character and Akinator will try to guess it',
    aliases: ['aki'],
    run: async (client, message, args) => {
        let server = await client.servers.fetch(serverId)
        let member = await server.members.fetch(message.authorId)
        if (!member || !member.roleIds.some(r => r == 32617887)) return message.reply(`❌ This command is currently restricted to beta testers.\nJoin our server to become Beta Tester and try new features\nhttps://guilded.gg/Himal`)
        const region = 'en', childMode = false, proxy = undefined
        const aki = new Aki({ region, childMode, proxy })
        let embed = new Embed()
            .setDescription("Yes - :+1:\nNo - :-1:\nDon't know - :question:\nProbably - :thinking_face:\nProbably not - :face_with_rolling_eyes:\nBack - :arrow_backward:")

        let j = 1, tries = 0, progress = 70
        await aki.start()
        embed.setTitle(`#${j} ${aki.question}`)
        let botMsg
        let reactions = [
            90001164, 90001170,
            90002188, 90000022,
            90000027, 90002144
        ]
        let reactionMap = {
            90001164: 0, 90001170: 1,
            90002188: 2, 90000022: 3,
            90000027: 4, 90002144: 5
        }
        await message.reply({ embeds: [embed] }).then(async (msg) => {
            botMsg = msg
            await msg.react(90001164)
            await msg.react(90001170)
            await msg.react(90002188)
            await msg.react(90000022)
            await msg.react(90000027)
            await msg.react(90002144)
        })
        while (true) {
            let reaction
            let usrReaction = await botMsg.awaitReactions({
                max: 1,
                time: 30_000,
                filter: (reaction) => reactions.includes(reaction.id) && reaction.createdBy === message.authorId
            })
            if (!usrReaction.first()) return message.channel.send('👀 They left me hanging')
            else reaction = usrReaction.first()
            let chosen = reactionMap[reaction.id]
            if (chosen === 5) {
                await aki.step(1)
                await aki.back()
                j--
            } else {
                await aki.step(chosen)
            }
            if (aki.progress >= progress || aki.currentStep >= 78) {
                await aki.win()
                tries++
                embed.setTitle(`Is your character ${aki.answers[0].name}?`)
                    .setDescription(`Ranked **#${aki.answers[0].ranking}**\n${aki.answers[0].description}`)
                    .setImage(aki.answers[0].absolute_picture_path)
                await botMsg.edit({ embeds: [embed] })
                let wincheck = await botMsg.awaitReactions({
                    max: 1,
                    time: 30_000,
                    filter: (reaction) => reactions.includes(reaction.id) && reaction.createdBy === message.authorId
                })
                if (!wincheck.first()) return message.channel.send(`👀 I took your silence as a Yes`)
                else if (wincheck.first().id === 90001164) return message.channel.send(`😏 Another easy victory in my book`)
                else if (wincheck.first().id === 90001170) {
                    progress = 80
                    if (tries > 1) return message.channel.send('😩 Okay, I give up')
                    embed.setTitle('😲 Wait, what happened to my supernatural powers?')
                        .setDescription("**You can give me one more try**\n\n**Do you want me to try again? (🔪 Yes is the only option here)**\n\nYes - :+1:\nNo - :-1:\nDon't know - :question:\nProbably - :thinking_face:\nProbably not - :face_with_rolling_eyes:\nBack - :arrow_backward:")
                        .setImage()
                    await botMsg.edit({ embeds: [embed] })
                    let tryChoice = await botMsg.awaitReactions({
                        max: 1,
                        time: 30_000,
                        filter: (reaction) => reactions.includes(reaction.id) && reaction.createdBy === message.authorId
                    })
                    if (!tryChoice.first()) return message.channel.send(`👀 I took your silence as a No`)
                    else if (tryChoice.first().id === 90001164) {
                        j++
                        embed.setTitle(`#${j} ${aki.question}`)
                            .setDescription("Yes - :+1:\nNo - :-1:\nDon't know - :question:\nProbably - :thinking_face:\nProbably not - :face_with_rolling_eyes:\nBack - :arrow_backward:")
                        await botMsg.edit({ embeds: [embed] })
                    } else return message.channel.send(`🤔 I took that as a No`)
                } else {
                    return message.channel.send(`🤔 I took that as a yes`)
                }
            } else {
                j++
                embed.setTitle(`#${j} ${aki.question}`)
                await botMsg.edit({ embeds: [embed] })
            }
        }
    }
}