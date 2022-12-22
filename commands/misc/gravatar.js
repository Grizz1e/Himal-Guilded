const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const crypto = require('crypto')

module.exports = {
    name: 'gravatar',
    category: 'misc',
    description: 'Shows gravatar profile of provided Email or username',
    args: ['username'],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply('❌ You did not provide your Gravatar username or email address')
        let hash
        if (args[0].includes('@')) {
            hash = crypto.createHash('md5').update(args[0]).digest('hex')
        } else {
            hash = args[0]
        }
        fetch(`https://gravatar.com/${hash}.json`).then(async (response) => {
            let res = await response.json()
            let dat = res.entry[0]
            let embed = new Embed()
                .setAuthor(dat.preferredUsername)
                .setTitle(dat.displayName)
                .setUrl(dat.profileUrl)
                .setThumbnail(dat.thumbnailUrl)
                .setFooter(`ID: ${dat.id}`)
            if (dat.aboutMe) embed.setDescription(dat.aboutMe)
            if (dat.accounts) embed.addField('Accounts', dat.accounts.map(account => `[${account.shortname}](${account.url})`).join('\n'), true)
            if (dat.urls.length > 0) embed.addField('URLs', dat.urls.map(url => `[${url.title}](${url.value})`).join('\n'), true)
            message.reply({ embeds: [embed] })
        }).catch((err) => {
            message.reply('⚠️ Could not find the Gravatar account')
        })
    }
}