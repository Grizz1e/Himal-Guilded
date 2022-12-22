const fetch = require('node-fetch')

module.exports = {
    name: 'dadjoke',
    category: 'fun',
    description: 'Tells you a random dad jokes',
    aliases: ['dj'],
    run: async (client, message, args) => {
        fetch('https://icanhazdadjoke.com/', { headers: { 'Accept': 'application/json' } }).then(async (response) => {
            let dat = await response.json()
            message.reply(dat.joke)
        })
    }
}