const fetch = require('node-fetch')
const { brainshop } = require('../../config.json').api

module.exports = {
    name: 'ask',
    category: 'fun',
    description: 'Ask any question and I shall answer',
    args: ['question'],
    run: async (client, message, args) => {
        if (!args[0]) {
            return message.reply('❌ Try `/ask What is 2 + 2?`')
        }
        if (message.authorId === 'dODMpQPm' && args[0] === 'chatgpt') {
            let content = await client.cgpt.ask(args.slice(0).join(' '))
            try {
                message.reply(content)
            } catch (err) {
                message.reply('⚠️ An error occurred')
            }
        } else {
            let content = encodeURIComponent(args.join(' '))
            fetch(`http://api.brainshop.ai/get?bid=154557&key=${brainshop}&uid=${message.createdById}&msg=${content}`).then(async (response) => {
                let res = await response.json()
                message.reply(res.cnt)
            })
        }
    }
}