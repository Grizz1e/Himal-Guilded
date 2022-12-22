const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'bunny',
    category: 'animals',
    description: 'Shows you random bunny image',
    aliases: ['rabbit'],
    run: async (client, message, args) => {
        fetch('https://api.bunnies.io/v2/loop/random/?media=gif,png').then(async (response) => {
            let res = await response.json()
            let dat = res.media.poster
            let embed = new Embed()
                .setTitle(':rabbit: Here\'s your random bunny')
                .setUrl(dat)
                .setImage(dat)
            message.reply({ embeds: [embed] })
        })

    }
}