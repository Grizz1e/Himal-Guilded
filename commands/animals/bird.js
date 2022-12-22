const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'bird',
    category: 'animals',
    description: 'Shows you random bird image',
    aliases: ['birb'],
    run: async (client, message, args) => {
        fetch('http://shibe.online/api/birds?count=1&urls=true&httpsUrls=true').then(async (response) => {
            let dat = await response.json()
            let embed = new Embed()
                .setTitle(':bird: Here\'s your random bird')
                .setUrl(dat[0])
                .setImage(dat[0])
            message.reply({ embeds: [embed] })
        })

    }
}