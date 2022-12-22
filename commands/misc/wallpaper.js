const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'wallpaper',
    category: 'misc',
    description: 'Shows you random wallpaper',
    run: async (client, message, args) => {
        fetch('https://meme-api.com/gimme/wallpaper').then(async (response) => {
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