module.exports = {
    name: 'purge',
    category: 'moderation',
    description: 'Deletes the provided number of messages from the channel',
    args: ['number'],
    run: async (client, message, args) => {
        let server = await client.servers.fetch(message.serverId)
        let usr = await server.members.fetch(message.authorId)
        if (!usr.isOwner) return message.reply('❌ As of now, only server owner can use moderation commands')

        if (!args[0]) return client.commands.get('help').run(client, message, ['purge'])

        const amountToDelete = Number(args[0], 10);
        if (isNaN(amountToDelete)) return message.reply('❌ Not a number')

        if (!Number.isInteger(amountToDelete)) {
            return message.reply(`❌ Not a valid number`)
        }
        if (!amountToDelete || amountToDelete < 1 || amountToDelete > 100) {
            return message.channel.send(`❌ Maximum of 100 messages can only be deleted at a time`)
        }
        const inChannel = await client.channels.fetch(message.channelId)
        await message.delete()
        const fetched = await inChannel.messages.fetch({ limit: amountToDelete });
        fetched.forEach(async msg => {
            await msg.delete()
        });
    }
}