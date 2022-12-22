const fetch = require('node-fetch')

module.exports = {
    name: 'bored',
    category: 'fun',
    description: 'Gives you a random task to do when you are bored',
    run: async (client, message, args) => {
        fetch('https://www.boredapi.com/api/activity/').then(async (response) => {
            let res = await response.json()
            message.reply(res.activity)
        })
    }
}