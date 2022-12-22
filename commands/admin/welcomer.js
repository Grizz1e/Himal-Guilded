const { Embed } = require("guilded.ts")

module.exports = {
    name: 'welcomer',
    category: 'admin',
    description: 'Set up welcomer for your server',
    subCommands: [
        {
            name: 'setchannel',
            description: 'Set the channel where you want to send welcome message',
            args: ['textChannelMention']
        }, {
            name: 'setmessage',
            description: 'Change the welcome message',
            args: ['welcomeMessage']
        }, {
            name: 'disable',
            description: 'Disable welcome message'
        }, {
            name: 'test',
            description: 'Preview welcome message'
        }
    ],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['welcomer'])
        let server = await client.servers.fetch(message.serverId)
        let usr = await server.members.fetch(message.authorId)
        if (!usr.isOwner) return message.reply('❌ As of now, only server owner can use moderation commands')
        if (args[0] === 'setchannel') {
            if (message.mentions && message.mentions.channels) {
                let channel = await client.channels.fetch(message.mentions.channels[0].id)
                if (channel.type !== 'chat') return message.reply('❌ It needs to be a text based channel')
                client.db.set(`${message.serverId}.welcomer`, { enabled: true, channel: channel.id, message: 'Hello {{User.Mention}}, welcome to **{{Server.Name}}**' }).then(() => {

                    message.reply(`✅ Enabled welcomer in #${channel.name}`)
                })
            } else {
                message.reply('❌ You did not provide a channel to send the logs')
            }
        } else if (args[0] === 'disable') {
            client.db.delete(`${message.serverId}.welcomer`).then(() => {
                message.reply('✅ Disable welcomer for this server')
            })
        } else if (args[0] === 'setmessage') {
            if (!args[1]) return message.reply('❌ Welcome message was not provided!')
            else {
                args.splice(0, 1)
                if (await client.db.get(`${message.serverId}.welcomer`) === null)
                    message.reply('⚠️ Welcomer is not properly configured in your server')
                else client.db.set(`${message.serverId}.welcomer.message`, args.join(' ')).then(() => {
                    message.reply('✅ Welcome message has been updated')
                })
            }
        } else if (args[0] === 'test') {
            let welcomerConf = await client.db.get(`${message.serverId}.welcomer`)
            if (welcomerConf === null || welcomerConf === undefined) return message.reply('⚠️ Welcomer is not properly gonfigured in your server')
            else {
                let usrMention = `<@${message.authorId}>`
                let server = await client.servers.fetch(message.serverId)
                let desc = welcomerConf.message.replace(/{{User.Mention}}/g, usrMention).replace(/{{Server.Name}}/g, server.name)
                let embed = new Embed()
                    .setTitle(`${message.author.user.name} joined the server!`)
                    .setDescription(desc)
                let channel = await client.channels.fetch(welcomerConf.channel)
                channel.send({ embeds: [embed] })

            }
        }

    }
}