module.exports = {
    name: 'cuteness',
    category: 'fun',
    description: 'Measures the cuteness of the user',
    aliases: [`cute`],
    run: async (client, message, args) => {
        let result = Math.floor((Math.random() * 101) + 1);
        let emojis = [`😘`, `😍`, `🤩`, `😳`, `🤭`, `👀`, `👄`, `👌`]
        let emoji = emojis[Math.floor(Math.random() * emojis.length)]
        message.reply(`You are ${result}% cute ${emoji}`);
    }
}