const { Embed } = require("guilded.ts")
const moment = require('moment')

module.exports = {
    name: 'serverinfo',
    category: 'utility',
    description: 'Calculates the given math problem',
    aliases: ['si'],
    run: async (client, message, args) => {
        let server = await client.servers.fetch(message.serverId)
        await server.members.fetch()
        let owner = await server.fetchOwner()
        let totalMembers = server.members.cache.size
        let bots = server.members.cache.filter(member => member.user.isBot).size
        let humans = totalMembers - bots
        let embed = new Embed()
            .setTitle(`${server.name}${server.isVerified ? '✅' : ''}`)
            .setDescription(server.about)
            .addField('Server Owner', `${owner.user.name}\n(${owner.id})`, true)
            .addField('Member Count', `:raising_hand:: \`${humans.toLocaleString()}\` :robot_face:: \`${bots.toLocaleString()}\`\nTotal: \`${totalMembers.toLocaleString()}\``, true)
            .addField('Custom URL', `[.gg/${server.url}](https://guilded.gg/${server.url})`, true)
        server.avatar ? embed.setThumbnail(server.avatar) : ''
        server.banner ? embed.setImage(server.banner) : ''
        server.type ? embed.addField('Server Type', server.type, true) : ''
        server.timezone ? embed.addField('Timezone', server.timezone, true) : ''
        embed.setUrl(`https://guilded.gg/${server.url}`)
            .setFooter(`Created on: ${moment(server.createdAt).format('Do MMMM YYYY, h:mm A')} (${moment(server.createdAt).fromNow()})`)
        message.reply({ embeds: [embed] })
    }
}