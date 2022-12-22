const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'fox',
    category: 'animals',
    description: 'Shows you random fox image',
    run: async (client, message, args) => {
        fetch('https://randomfox.ca/floof/').then(async (response) => {
            let res = await response.json()
            let dat = res.image
            let embed = new Embed()
                .setTitle(':fox_face: Here\'s your random fox')
                .setUrl(res.link)
                .setImage(dat)
            message.reply({ embeds: [embed] })
        })

    }
}