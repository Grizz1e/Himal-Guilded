const fetch = require("node-fetch");

module.exports = {
    name: 'insult',
    category: 'fun',
    description: 'Insults the mentioned user',
    args: ['userMention'],
    run: async (client, message, args) => {
        fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json').then(async (response) => {
            let data = await response.json()
            message.reply(data.insult)
        })
    }
}