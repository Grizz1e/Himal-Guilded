const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const { nasa } = require('../../config.json').api

module.exports = {
    name: 'apod',
    category: 'misc',
    description: 'Shows Astronomy Picture of the Day by NASA',
    run: async (client, message, args) => {
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${nasa}`).then(async (response) => {
            let res = await response.json()
            let embed = new Embed()
                .setTitle(res.title)
                .setUrl(res.url)
                .setDescription(res.explanation)
                .setImage(res.hdurl)
                .setFooter(`©️ - ${res.copyright}`)
            message.reply({ embeds: [embed] })
        })
    }
}