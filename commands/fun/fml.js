const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const load = require('cheerio').load

module.exports = {
    name: 'fml',
    category: 'fun',
    description: 'Shares a random fmylife story',
    run: async (client, message, args) => {
        let response = await fetch("https://www.fmylife.com/random")
        let body = await response.text()
        const $ = load(body)
        let msg = $("a.block.text-blue-500.my-4").text().split('\n\n')[0].trim()
        let embed = new Embed()
            .setDescription(msg)
        message.reply({ embeds: [embed] })
    }
}