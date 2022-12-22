const fetch = require("node-fetch");
const { Embed } = require("guilded.ts");
const { filterURL } = require("../../Utils/functions");

module.exports = {
    name: 'isitup',
    category: 'utility',
    description: 'checks whether the provided site is up or not',
    args: ['domain'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['isitup'])
        let filteredURL = filterURL(args[0]).replace('https://', '').replace('http://', '')
        fetch(`https://isitup.org/${filteredURL}.json`).then(async (response) => {
            let res = await response.json()
            let embed = new Embed()
                .setTitle(`**${res.domain}** ${res.status_code === 1 ? `is up :tada:` : 'seems to be down :boom:'}`)
                .setDescription(`It took ${res.response_time} seconds to get a ${res.response_code} status code from an IP address of ${res.response_ip}.`)
            message.reply({ embeds: [embed] })
        }).catch((err) => {
            message.reply({ content: '⚠️ An error occurred' })
        })
    }
}