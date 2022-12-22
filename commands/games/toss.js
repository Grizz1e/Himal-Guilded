module.exports = {
    name: 'toss',
    category: 'games',
    description: 'tosses a coin',
    run: async (client, message, args) => {
        let choices = [
            'Tails',
            'Heads',
        ]
        let botChoice = choices[Math.floor(Math.random() * 2)]
        message.reply(`🪙 It landed **${botChoice}**!`)
    }
}