const fetch = require('node-fetch')
const { Embed } = require('guilded.ts')

module.exports = {
    name: 'mcserver',
    category: 'games',
    description: 'Shows status of the minecraft server',
    args: ['serverIP'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['mcserver'])
        fetch(`https://api.minetools.eu/ping/${args[0]}`).then(async (response) => {
            let res = await response.json()
            let embed = new Embed()
                .setAuthor(args[0], `https://api.minetools.eu/favicon/${args[0]}`)
                .setThumbnail(`https://api.minetools.eu/favicon/${args[0]}`)
                .addField('Latency', `\`${Math.round(res.latency)}\``, true)
                .addField('Online players', `\`${res.players.online.toLocaleString()}\` / \`${res.players.max.toLocaleString()}\``, true)
                .addField('Version', res.version.name, true)
                .addField('Motd', "```\n" + res.description + "\n```")
            message.reply({ embeds: [embed] })
        }).catch((err) => {
            message.reply({ content: "⚠️ Couldn't locate the server" })
        })
    }
}