const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'duck',
    category: 'animals',
    description: 'Shows you random duck image',
    run: async (client, message, args) => {
        fetch('https://random-d.uk/api/v1/random?type=png').then(async (response) => {
            let res = await response.json()
            let embed = new Embed()
                .setTitle(':duck: Here\'s your random duck')
                .setUrl(res.url)
                .setImage(res.url)
                .setFooter(res.message)
            message.reply({ embeds: [embed] })
        })

    }
}