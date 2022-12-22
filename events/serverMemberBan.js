const { Embed } = require("guilded.ts");

module.exports = {
    name: 'serverMemberBan',
    async execute(serverBan, client) {
        let dbInfo = await client.db.get(`${serverBan.server.id}.logging`)
        if (dbInfo && dbInfo.enabled) {
            let toLogChannel = await client.channels.fetch(dbInfo.channel).catch(async (err) => {
                return await client.db.delete(`${server.id}.logging`)
            })
            if (!toLogChannel) return
            let embed = new Embed()
                .setTitle('Member Banned From the server!')
                .setDescription(serverBan.reason || 'Reason not available')
                .addField('User ID', serverBan.user.id)
                .addField('Banned By', serverBan.createdBy)
            toLogChannel.send({ embeds: [embed] })
        }

    },
};