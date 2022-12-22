const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const curSync = require('../../Utils/curSync.json')

module.exports = {
    name: 'exchangerate',
    category: 'utility',
    description: 'Shows exchange rates for the provided currency. (Supports popular cryptocurrencies)',
    args: ['fromCurrencyCode', 'fromCurrencyCode toCurrencyCode'],
    aliases: ['er'],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply('❌ The currency code was not provided')
        let url
        if (!args[1]) {
            url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${args[0]}.json`
        } else {
            url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${args[0]}/${args[1]}.json`
        }
        try {
            fetch(url).then(async (response) => {
                let res = await response.json()
                let embed = new Embed()
                    .setAuthor(`1.0 ${curSync[args[0]]} equals`)
                    .setFooter(`Source: fawazahmed0`)
                if (args[1]) {
                    embed.setTitle(`${res[args[1].toLowerCase()].toLocaleString()} ${curSync[args[1]]}`)
                    message.reply({ embeds: [embed] })
                } else {
                    let mainCur = res[args[0].toLowerCase()]
                    embed.setDescription(`USD ($) : \`${mainCur.usd.toLocaleString()}\`
GBP (£) : \`${mainCur.gbp.toLocaleString()}\`
EUR (€) : \`${mainCur.eur.toLocaleString()}\`
BTC (₿) : \`${mainCur.btc.toLocaleString()}\`
ETH (Ξ) : \`${mainCur.eth.toLocaleString()}\``)
                        .setFooter(`Source: fawazahmed0`)
                    message.reply({ embeds: [embed] })
                }
            })
        } catch (err) {
            message.reply('⚠️ An unexpected error occurred')
        }
    }
}