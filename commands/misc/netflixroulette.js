const fetch = require('node-fetch')
const { Embed } = require('guilded.ts')
const { min2HrMin } = require('../../Utils/functions.js')

module.exports = {
    name: 'netflixroulette',
    category: 'misc',
    description: 'One command to get random netflix shows',
    aliases: ['nr'],
    run: async (client, message, args) => {
        let genre = 0, type = 'both', imdb = 0, genreTxt = 'All Genres'
        let genreSync = [
            [0, 'All Genres'], [5, 'Action & Adventure'], [6, 'Animation'],
            [39, 'Anime'], [7, 'Biography'], [8, 'Children'],
            [9, 'Comedy'], [10, 'Crime'], [41, 'Cult'],
            [11, 'Documentary'], [3, 'Drama'], [12, 'Family'],
            [15, 'Food'], [16, 'Game Show'], [17, 'History'],
            [18, 'Home & Garden'], [19, 'Horror'], [37, 'LGBTQ'],
            [22, 'Musical'], [23, 'Mystery'], [25, 'Reality'],
            [4, 'Romance'], [26, 'Science-Fiction'], [29, 'Sport'],
            [45, 'Stand-up & Talk'], [32, 'Thriller'], [33, 'Travel'],
            [36, 'Western']
        ]
        let choiceToGenre = {
            1: 0, 2: 5, 3: 6,
            4: 39, 5: 7, 6: 8,
            7: 9, 8: 10, 9: 41,
            10: 11, 11: 3, 12: 12,
            13: 15, 14: 16, 15: 17,
            16: 18, 17: 19, 18: 37,
            19: 22, 20: 23, 21: 25,
            22: 4, 23: 26, 24: 29,
            25: 45, 26: 32, 27: 33,
            28: 36
        }
        let embed = new Embed()
            .setTitle('Netflix Roulette: What Should You Watch?')
            .setDescription(`**GENRE:** \`All Genres\`
**TYPE:** ✅ **Movies**    ✅ **TV Shows**
**IMDB:** \`Any Score\`

You can send the following message in chat:
\`spin\` - To spin the roulette
\`genre\` - To change the genre
\`type\` - To change the type
\`rating\` - To set the minimum IMDb rating`)
            .setFooter('You have 20 seconds')
        await message.reply({ embeds: [embed] })
        while (true) {
            let msg = await message.channel.awaitMessages({
                max: 1,
                timeLimit: 20_000,
                filter: (msg) => msg.authorId === message.authorId
            })
            let choice = msg.first()
            if (!choice) return
            else if (choice.content === 'spin') {
                let url = `https://api.reelgood.com/v3.0/content/random?availability=onSources&content_kind=${type}${genre === 0 ? '' : `&genre=${genre}`}${imdb === 0 ? '' : `${imdb === 0 ? '' : `&minimum_imdb=${imdb}`}`}&nocache=true&region=us&sources=netflix&spin_count=1`
                let response = await fetch(url)
                let dat
                try {
                    dat = await response.json()
                } catch (err) {
                    return choice.reply('⚠️ No result found for your query')
                }
                let embed = new Embed()
                    .setTitle(dat.title)
                    .setUrl(`https://reelgood.com/${dat.content_type === 'm' ? 'movie' : 'show'}/${dat.slug}`)
                !!dat.classification ? embed.addField('Age Rating', dat.classification, true) : ''
                !!dat.imdb_rating ? embed.addField('IMDb Rating', `\`${dat.imdb_rating}/10\``, true) : ''
                !!dat.runtime ? embed.addField('Runtime', min2HrMin(dat.runtime), true) : ''
                !!dat.season_count ? embed.addField('Seasons', dat.season_count.toLocaleString(), true) : ''
                dat.has_poster ? embed.setThumbnail(`https://img.rgstatic.com/content/${dat.content_type === 'm' ? 'movie' : 'show'}/${dat.id}/poster-780.webp`) : ''
                embed.setDescription(dat.overview)
                    .setFooter('Source: Reelgood.com')
                return choice.reply({ embeds: [embed] })

            } else if (choice.content === 'genre') {
                let genres = genreSync.map((x, i) => `\`${i + 1}\`. **${x[1]}${(i + 1) % 3 === 0 ? ',\n' : ','}**`).join(' ')

                embed.setDescription(`These are all the available genres:\n\n${genres}\n\nType any number from 1 to 28 to select genre`)
                await choice.reply({ embeds: [embed] })
                msg = await message.channel.awaitMessages({
                    max: 1,
                    timeLimit: 20_000,
                    filter: (msg) => msg.authorId === message.authorId
                })
                choice = msg.first()
                if (!choice) return
                let genreNum = parseInt(choice.content)
                if (isNaN(genreNum) || genreNum > 28 || genreNum < 1) return choice.reply('❌ Invalid choice!')
                else {
                    genre = choiceToGenre[genreNum]
                    genreTxt = genreSync[genreNum - 1][1]
                    embed.setDescription(`**GENRE:** \`${genreTxt}\`
**TYPE:** ${type === 'both' || type === 'movie' ? '✅' : '⬛'} **Movies**    ${type === 'both' || type === 'show' ? '✅' : '⬛'} **TV Shows**
**IMDB:** \`${imdb < 5 ? 'Any Score' : `> ${imdb}`}\`

You can send the following message in chat:
\`spin\` - To spin the roulette
\`genre\` - To change the genre
\`type\` - To change the type
\`rating\` - To set the minimum IMDb rating`)
                    await choice.reply({ embeds: [embed] })
                }
            } else if (choice.content === 'type') {
                embed.setDescription(`These are all the available types:\n\n\`1.\` Movies\n\`2.\` TV Shows\n\`3.\` Both\n\nType any number from 1 to 3 to select type`)
                await choice.reply({ embeds: [embed] })
                msg = await message.channel.awaitMessages({
                    max: 1,
                    timeLimit: 20_000,
                    filter: (msg) => msg.authorId === message.authorId
                })
                choice = msg.first()
                if (!choice) return
                let typeNum = parseInt(choice.content)
                if (isNaN(typeNum) || typeNum > 3 || typeNum < 1) return choice.reply('❌ Invalid choice!')
                else {
                    type = typeNum === 1 ? 'movie' : typeNum === 2 ? 'show' : 'both'
                    embed.setDescription(`**GENRE:** \`${genreTxt}\`
**TYPE:** ${type === 'both' || type === 'movie' ? '✅' : '⬛'} **Movies**    ${type === 'both' || type === 'show' ? '✅' : '⬛'} **TV Shows**
**IMDB:** \`${imdb < 5 ? 'Any Score' : `> ${imdb}`}\`

You can send the following message in chat:
\`spin\` - To spin the roulette
\`genre\` - To change the genre
\`type\` - To change the type
\`rating\` - To set the minimum IMDb rating`)
                    await choice.reply({ embeds: [embed] })
                }
            } else if (choice.content === 'rating') {
                embed.setDescription(`Type any number from 5 to 9 to select minimum rating`)
                await choice.reply({ embeds: [embed] })
                msg = await message.channel.awaitMessages({
                    max: 1,
                    timeLimit: 20_000,
                    filter: (msg) => msg.authorId === message.authorId
                })
                choice = msg.first()
                if (!choice) return
                let ratingNum = parseInt(choice.content)
                if (isNaN(ratingNum) || ratingNum > 9 || ratingNum < 5) return choice.reply('❌ Invalid choice!')
                else {
                    imdb = ratingNum
                    embed.setDescription(`**GENRE:** \`${genreTxt}\`
**TYPE:** ${type === 'both' || type === 'movie' ? '✅' : '⬛'} **Movies**    ${type === 'both' || type === 'show' ? '✅' : '⬛'} **TV Shows**
**IMDB:** \`${imdb < 5 ? 'Any Score' : `> ${imdb}`}\`

You can send the following message in chat:
\`spin\` - To spin the roulette
\`genre\` - To change the genre
\`type\` - To change the type
\`rating\` - To set the minimum IMDb rating`)
                    await choice.reply({ embeds: [embed] })
                }
            }
        }
    }
}