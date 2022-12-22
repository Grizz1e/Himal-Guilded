const fetch = require('node-fetch')
const { Embed } = require('guilded.ts')

module.exports = {
    name: 'mcskin',
    category: 'games',
    description: 'Shows the skin of the Minecraft player',
    args: ['username'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['mcskin'])
        fetch(`https://mc-heads.net/avatar/${args[0]}`).then(async (response) => {
            let embed = new Embed()
                .setAuthor(args[0], `https://mc-heads.net/avatar/${args[0]}`)
                .setImage(`https://mc-heads.net/body/${args[0]}`)
                .setThumbnail(`https://mc-heads.net/avatar/${args[0]}`)
                .addField('Other variations', `• [\`Skin\`](https://mc-heads.net/skin/${args[0]})\n• [\`Combo\`](https://mc-heads.net/combo/${args[0]})\n• [\`Full body 2D\`](https://mc-heads.net/player/${args[0]})`, true)
                .addField('Quick links', `• [\`Download skin\`](https://mc-heads.net/download/${args[0]})\n• [\`Change your skin\`](https://mc-heads.net/change/${args[0]})`, true)
            message.reply({ embeds: [embed] })
        }).catch((err) => {
            message.reply({ content: "⚠️ Couldn't find the player" })
        })
    }
}