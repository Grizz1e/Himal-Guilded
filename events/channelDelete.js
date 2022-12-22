const { Embed } = require("guilded.ts");

module.exports = {
    name: 'channelDelete',
    async execute(channel, client) {
        let dbInfo = await client.db.get(`${channel.serverId}.logging`)
        if (dbInfo && dbInfo.enabled) {
            let toLogChannel = await client.channels.fetch(dbInfo.channel).catch(async (err) => {
                return await client.db.delete(`${channel.serverId}.logging`)
            })
            let embed = new Embed()
                .setTitle('Channel Deleted!')
                .addField('Name', channel.name, true)
                .addField('Channel Type', channel.type, true)
                .setFooter(`ID: ${channel.id}`)
            toLogChannel.send({ embeds: [embed] })
        }

    },
};