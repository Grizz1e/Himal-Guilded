const Minesweeper = require('discord.js-minesweeper');
const { createMs } = require('../../Utils/functions.js')
const { Embed } = require('guilded.ts')

module.exports = {
    name: 'minesweeper',
    category: 'games',
    description: 'Play a game of Minesweeper',
    aliases: ['ms'],
    run: async (client, message, args) => {
        const minesweeper = new Minesweeper({
            rows: 7,
            columns: 7,
            mines: 15,
            emote: 'bomb',
            returnType: 'matrix',
        });
        let arr = minesweeper.start()
        let dat = createMs(arr)
        let embed = new Embed()
            .setDescription(dat)
        message.reply({ embeds: [embed] })
    }
}