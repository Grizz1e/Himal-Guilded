module.exports = {
    name: 'log',
    category: 'admin',
    description: 'Enable/disable logging and set up log channel',
    subCommands: [
        {
            name: 'setchannel',
            description: 'Set the channel where you want to send the logs',
            args: ['textChannelMention']
        }, {
            name: 'disable',
            description: 'Disable autologger in your server'
        }
    ],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['log'])
        let server = await client.servers.fetch(message.serverId)
        let usr = await server.members.fetch(message.authorId)
        if (!usr.isOwner) return message.reply('❌ As of now, only server owner can use moderation commands')
        if (args[0] === 'setchannel') {
            if (message.mentions && message.mentions.channels) {
                let channel = await client.channels.fetch(message.mentions.channels[0].id)
                if (channel.type !== 'chat') return message.reply('❌ It needs to be a text based channel')
                client.db.set(`${message.serverId}.logging`, { enabled: true, channel: channel.id }).then(() => {
                    message.reply(`✅ Enabled logs in #${channel.name}`)
                })
            } else {
                message.reply('❌ You did not provide a channel to send the logs')
            }
            // 
        } else if (args[0] === 'disable') {
            client.db.delete(`${message.serverId}.logging`).then(() => {
                message.reply('✅ Disable logging for this server')
            })
        }

    }
}