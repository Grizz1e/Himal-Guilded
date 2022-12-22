module.exports = {
    name: "invite",
    description: "Sends you a link to invite me to your server",
    category: "bot",
    run: async (client, message, args) => {
        message.reply(' [Click Here](https://www.guilded.gg/b/92151c8b-2731-433b-a8d2-d051db1248e9)\nOR, Visit: https://www.guilded.gg/b/92151c8b-2731-433b-a8d2-d051db1248e9')
    }
}