const { Embed } = require("guilded.ts");

module.exports = {
    name: 'channelCreate',
    async execute(channel, client) {
        let dbInfo = await client.db.get(`${channel.serverId}.logging`)
        if (dbInfo && dbInfo.enabled) {
            let toLogChannel = await client.channels.fetch(dbInfo.channel).catch(async (err) => {
                return await client.db.delete(`${channel.serverId}.logging`)
            })
            if (!toLogChannel) return
            let embed = new Embed()
                .setTitle('New Channel Created!')
                .addField('Name', channel.name)
                .addField('Created By', `<@${channel.createdBy}>`, true)
                .addField('Channel Type', channel.type, true)
                .setFooter(`ID: ${channel.id}`)
            toLogChannel.send({ embeds: [embed] })
        }

    },
};