module.exports = {
    name: 'nick',
    category: 'moderation',
    description: 'Change or reset the nickname of any member',
    args: ['userMention nickname', 'userMention'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['nick'])
        let server = await client.servers.fetch(message.serverId)
        let usr = await server.members.fetch(message.authorId)
        if (!usr.isOwner) return message.reply('❌ As of now, only server owner can use moderation commands')

        if (!message.mentions || !message.mentions.users) return message.reply('❌ You need to mention at least a user')
        let mentionUser = await server.members.fetch(message.mentions.users[0].id)
        if (!mentionUser) return message.reply('⚠️ No user found!')
        let nickOrUsername = mentionUser.nickname ? mentionUser.nickname : mentionUser.user.name
        let trimAmt = nickOrUsername.trim().split(' ').length
        if (!args[trimAmt]) {
            try {
                await mentionUser.removeNickname()
                message.reply('✅ Nickname has been reset')
            } catch (err) {
                message.reply(`⚠️ ${err.message}`)
            }

        } else {
            try {
                await mentionUser.setNickname(args.slice(trimAmt).join(' '))
                message.reply('✅ Nickname has been updated')
            } catch (err) {
                message.reply(`⚠️ ${err.message}`)
            }
        }
    }
}