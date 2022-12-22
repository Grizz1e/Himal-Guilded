const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'highfive',
    category: 'anime',
    description: 'Give a highfive to the mentioned user',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['highfive'])
        fetch('https://nekos.best/api/v2/highfive').then(async (response) => {
            let res = await response.json()
            let dat = res.results[0]
            let embed = new Embed()
                .setTitle(`You gave a highfive to ${args[0]}`)
                .setImage(dat.url)
                .setFooter(`From: ${dat.anime_name}`)
            message.reply({ embeds: [embed] })
        })
    }
}