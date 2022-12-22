module.exports = {
    name: 'toggleafk',
    category: 'admin',
    description: 'Enable/disable AFK message in your server',
    run: async (client, message, args) => {
        let server = await client.servers.fetch(message.serverId)
        let usr = await server.members.fetch(message.authorId)
        if (!usr.isOwner) return message.reply('❌ As of now, only server owner can use moderation commands')
        let afkStatus = await client.db.get(`${message.serverId}.showAfk`)
        if (afkStatus === undefined || afkStatus === null) {
            await client.db.set(`${message.serverId}.showAfk`, false)
            message.reply('✅ Successfully set the AFK display message to `false`')
        } else if (afkStatus) {
            await client.db.set(`${message.serverId}.showAfk`, false)
            message.reply('✅ Successfully set the AFK display message to `false`')
        } else {
            await client.db.delete(`${message.serverId}.showAfk`)
            message.reply('✅ Successfully set the AFK display message to `true`')
        }

    }
}