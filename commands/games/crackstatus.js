const { Embed } = require('guilded.ts');
const fetch = require('node-fetch')

module.exports = {
    name: 'crackstatus',
    category: 'games',
    description: 'Checks whether the given game is cracked or not',
    args: ['gameTitle'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['crackstatus'])
        let title = args.join(' ')
        let options = {
            method: 'POST',
            url: 'https://gamestatus.info/back/api/gameinfo/game/search_title/',
            headers: {
                Accept: '*/*',
                'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
                'Content-Type': 'application/json'
            },
            data: { title: title }
        };
        fetch(options).then(async (response) => {
            let res = await response.json()
            if (res.length < 1) {
                return message.reply("⚠️ No game found of that name")
            } else {
                let dat = res[0]
                let embed = new Embed()
                    .setColor(dat.crack_date ? "GREEN" : "RED")
                    .setTitle(dat.title)
                dat.teaser_link ? embed.setUrl(dat.teaser_link) : ''
                embed.setImage(dat.short_image)
                    .addField('Status', dat.readable_status, true)
                    .addField('Metascore', dat.mata_score ? `\`${dat.mata_score}\`` : "---", true)
                    .addField('Userscore', dat.user_score ? `\`${dat.user_score}\`` : "---", true)
                    .addField('Protections', JSON.parse(dat.protections).join(', '), true)
                    .addField('Group', dat.hacked_group === "[]" ? JSON.parse(dat.protections).join(', ') : "---", true)
                    .addField('Crack Date', dat.crack_date ? dat.crack_date : "---", true)
                    .setFooter('Powered by: Gamestatus.info')
                message.reply({ embeds: [embed] })
            }
        })
    }
}