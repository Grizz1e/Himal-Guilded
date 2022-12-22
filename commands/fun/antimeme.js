const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'antimeme',
    category: 'fun',
    description: 'Shows you a random antimeme',
    run: async (client, message, args) => {
        fetch("https://meme-api.com/gimme/antimeme").then(async (response) => {
            let dat = await response.json()
            let embed = new Embed()
                .setImage(dat.url)
                .setTitle(dat.title)
                .setUrl(dat.postLink)
                .setFooter(`u/${dat.author} • ${dat.ups}👍`)
            message.reply({ embeds: [embed] })
        })

    }
}