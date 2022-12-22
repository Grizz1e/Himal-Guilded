module.exports = {
    name: 'ban',
    category: 'moderation',
    description: 'Bans all the mentioned users',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['ban'])
        let server = await client.servers.fetch(message.serverId)
        let usr = await server.members.fetch(message.authorId)
        if (!usr.isOwner) return message.reply('❌ As of now, only server owner can use moderation commands')

        if (!message.mentions || !message.mentions.users) return message.reply('❌ You need to mention at least a user')
        message.mentions.users.forEach(async usr => {
            let toBeBanned = await server.members.fetch(usr.id)
            await toBeBanned.ban().then(() => {
                message.reply(`✅ Banned ${toBeBanned.user.name}`)
            })
        })
    }
}