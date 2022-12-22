const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const { sec2HrMinSec, filterURL } = require('../../Utils/functions')

module.exports = {
    name: 'whatanime',
    category: 'anime',
    description: 'Provide the image URL and the bot will detect which anime it is from',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply('❌ No Image URL found')
        fetch(`https://api.trace.moe/search?anilistInfo&url=${filterURL(args[0])}`).then(async (response) => {
            let res = await response.json()
            let dat = res.result

            if (!dat) return message.reply('⚠️ I could not determine the anime this image was taken from')
            let embed = new Embed()
                .setImage(dat[0].image)
                .setTitle(`This image was most likely taken from ${dat[0].anilist.title.english || dat[0].anilist.title.romaji || dat[0].anilist.title.native}`)
                .addField('Episode', dat[0].episode, true)
                .addField('Confidence', `${dat[0].similarity.toFixed(2) * 100}%`, true)
                .addField('Timestamp', `${sec2HrMinSec(dat[0].from)} - ${sec2HrMinSec(dat[0].to)}`)
            message.reply({ embeds: [embed] })
        }).catch((err) => {
            message.reply('⚠️ An unexpected error occurred')
        })
        //         let query = `
        // query ($id: Int) {
        //   Media (id: $id, type: ANIME) {
        //     id
        //     title {
        //       romaji
        //       english
        //       native
        //     }
        //   }
        // }
        // `
        //         let variables = {
        //             id: 15125
        //         }
        //         let url = 'https://graphql.anilist.co',
        //             options = {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'Accept': 'application/json',
        //                 },
        //                 body: JSON.stringify({
        //                     query: query,
        //                     variables: variables
        //                 })
        //             };
        //         fetch(url, options).then(async (response) => {

        //         })
    }
}