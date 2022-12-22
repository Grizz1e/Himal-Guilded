module.exports = {
    name: 'kick',
    category: 'moderation',
    description: 'Kicks all the mentioned users',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['kick'])
        let server = await client.servers.fetch(message.serverId)
        let usr = await server.members.fetch(message.authorId)
        if (!usr.isOwner) return message.reply('❌ As of now, only server owner can use moderation commands')

        if (!message.mentions || !message.mentions.users) return message.reply('❌ You need to mention at least a user')
        message.mentions.users.forEach(async usr => {
            let toBeKicked = await server.members.fetch(usr.id)
            await toBeKicked.kick().then(() => {
                message.reply(`✅ Kicked ${toBeKicked.username}`)
            })
        })
    }
}