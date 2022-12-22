const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'lizard',
    category: 'animals',
    description: 'Shows you random lizard image',
    run: async (client, message, args) => {
        fetch('https://nekos.life/api/v2/img/lizard').then(async (response) => {
            let res = await response.json()
            let dat = res.url
            let embed = new Embed()
                .setTitle(':lizard: Here\'s your random lizard')
                .setUrl(dat)
                .setImage(dat)
            message.reply({ embeds: [embed] })
        })

    }
}