const fetch = require('node-fetch')
const { Embed } = require('guilded.ts')
const { convert } = require('html-to-text');
const moment = require('moment')

module.exports = {
    name: 'fbi',
    description: 'Shows you random FBI wanted person',
    category: 'misc',
    run: async (client, message, args) => {
        let randPage = Math.floor(Math.random() * 45) + 1
        let randCrime = Math.floor(Math.random() * 20)
        fetch(`https://api.fbi.gov/wanted/v1/list?page=${randPage.toString()}`).then(async (response) => {
            let res = await response.json()
            let dat = res.items[randCrime]
            let embed = new Embed()
                .setThumbnail(dat.images[0].large)
                .setUrl(dat.url)
                .setAuthor(dat.title)
            dat.description ? embed.setDescription(convert(dat.description).replace(/[;]/g, '\n')) : ''
            dat.subjects ? embed.addField('Subjects', dat.subjects.join('\n')) : ''
            dat.age_range ? embed.addField('Age', `\`${dat.age_min}\` - \`${dat.age_max}\``, true) : ''
            dat.height ? embed.addField('Height', `\`${dat.height_min}\` - \`${dat.height_max}\``, true) : ''
            dat.sex ? embed.addField('Sex', dat.sex, true) : ''
            dat.race ? embed.addField('Race', dat.race, true) : ''
            dat.eyes ? embed.addField('Eyes', dat.eyes, true) : ''
            dat.dates_of_birth_used ? embed.addField('Dates of birth used', dat.dates_of_birth_used.join('\n'), true) : ''
            dat.place_of_birth ? embed.addField('Place of birth', dat.place_of_birth, true) : ''
            dat.scars_and_marks ? embed.addField('Scars and marks', dat.scars_and_marks.replace(/[;]/g, '\n')) : ''
            dat.remarks ? embed.addField('Remarks', convert(dat.remarks)) : ''
            dat.nationality ? embed.addField('Nationality', dat.nationality, true) : ''
            embed.setFooter(`Last modified: ${moment(dat.modified).format('D MMMM, YYYY')}`)
            message.reply({ embeds: [embed] })
        }).catch((err) => {
            message.reply('⚠️ An unexpected error occurred!')
        });
    }
}