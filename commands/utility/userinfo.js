const { Embed } = require("guilded.ts")
const moment = require('moment')

module.exports = {
    name: 'userinfo',
    category: 'utility',
    description: 'Displays the public info of the mentioned user',
    noArgs: true,
    args: ['userMention'],
    aliases: ['ui'],
    run: async (client, message, args) => {
        let server = await client.servers.fetch(message.serverId)
        let member = !message.mentions || !message.mentions.users ?
            await server.members.fetch(message.authorId) :
            await server.members.fetch(message.mentions.users[0].id)
        if (!member) return message.reply('⚠️ No user found')
        let embed = new Embed()
            .setAuthor(member.nickname || member.user.name)
            .setTitle(member.user.name)
        member.user.avatar ? embed.setThumbnail(member.user.avatar) : ''
        member.user.banner ? embed.setImage(member.user.banner) : ''
        embed.setFooter(member.id)
            .setDescription(`**Total Roles:** ${member.raw.roleIds.length}
            **Server Join:** \`${moment(member.joinedAt).format('Do MMMM YYYY, h:mm A')}\` (${moment(member.joinedAt).fromNow()})
            **Account Created:** \`${moment(member.user.createdAt).format('Do MMMM YYYY, h:mm A')}\` (${moment(member.user.createdAt).fromNow()})`)

        message.reply({ embeds: [embed] })

    }
}