const fetch = require('node-fetch')

module.exports = {
    name: 'advice',
    category: 'fun',
    description: "Gives you some random advice. (Don't take it seriously)",
    run: async (client, message, args) => {
        fetch('https://api.adviceslip.com/advice').then(async (response) => {
            let res = await response.json()
            message.reply(res.slip.advice)
        })
    }
}