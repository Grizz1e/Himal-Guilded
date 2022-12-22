const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'dog',
    category: 'animals',
    description: 'Shows you random dog image',
    run: async (client, message, args) => {
        fetch('https://dog.ceo/api/breeds/image/random').then(async (response) => {
            let res = await response.json()
            let dat = res.message
            let embed = new Embed()
                .setTitle(':dog: Here\'s your random dog')
                .setUrl(dat)
                .setImage(dat)
            message.reply({ embeds: [embed] })
        })

    }
}