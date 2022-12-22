const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'animewallpaper',
    category: 'anime',
    description: 'Shows you random anime wallpaper',
    aliases: ['aw'],
    run: async (client, message, args) => {
        fetch('https://meme-api.com/gimme/animewallpaper').then(async (response) => {
            let res = await response.json()
            let dat = res.url
            let embed = new Embed()
                .setTitle(':frame_with_picture: Click here to view in HD')
                .setUrl(dat)
                .setImage(dat)
            message.reply({ embeds: [embed] })
        })

    }
}