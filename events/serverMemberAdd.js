const { Embed } = require("guilded.ts");
const moment = require("moment/moment");

module.exports = {
    name: 'serverMemberAdd',
    async execute(member, client) {
        let logInfo = await client.db.get(`${member.server.id}.logging`)
        let welcomerInfo = await client.db.get(`${member.server.id}.welcomer`)
        if (logInfo && logInfo.enabled) {
            let toLogChannel = await client.channels.fetch(logInfo.channel).catch(async (err) => {
                return await client.db.delete(`${member.serverId}.logging`)
            })
            if (!toLogChannel) return
            let embed = new Embed()
                .setTitle('New Member Joined The Server!')
                .addField('Username', member.user.name)
                .addField('Account Created', `${moment(member.joinedAt).format('DD/MM/YYYY')} (${moment(member.joinedAt).fromNow()})`)
                .setFooter(`ID: ${member.id}`)
            toLogChannel.send({ embeds: [embed] })
        }
        if (welcomerInfo && welcomerInfo.enabled) {
            let toSendChannel = await client.channels.fetch(welcomerInfo.channel).catch(async (err) => {
                return await client.db.delete(`${member.serverId}.welcomer`)
            })
            if (!toSendChannel) return
            let usrMention = `<@${member.id}>`
            let server = await client.servers.fetch(member.serverId)
            let desc = welcomerInfo.message.replace(/{{User.Mention}}/g, usrMention).replace(/{{Server.Name}}/g, server.name)
            let embed = new Embed()
                .setTitle(`${member.user.name} joined the server!`)
                .setDescription(desc)
            let channel = await client.channels.fetch(welcomerInfo.channel)
            channel.send({ embeds: [embed] })
        }

    },
};