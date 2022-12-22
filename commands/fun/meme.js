const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'meme',
    category: 'fun',
    description: 'Shows you a random meme from the internet',
    run: async (client, message, args) => {
        fetch("https://meme-api.com/gimme").then(async (response) => {
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