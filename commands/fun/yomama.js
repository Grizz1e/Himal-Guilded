const fetch = require("node-fetch");

module.exports = {
    name: 'yomama',
    category: 'fun',
    description: 'Tells a random yomama joke',
    run: async (client, message, args) => {
        fetch('https://api.yomomma.info/').then(async (response) => {
            let res = await response.json()
            message.reply(res.joke)
        })
    }
}