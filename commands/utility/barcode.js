const { Embed } = require('guilded.ts')

module.exports = {
    name: 'barcode',
    category: 'utility',
    description: 'Generates a barcode',
    args: ['textMessage'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['barcode'])
        let embed = new Embed()
            .setImage(`https://www.barcodesinc.com/generator/image.php?code=${args[0]}&style=190&type=C128B&xres=1&font=3`)
        message.reply({ embeds: [embed] })
    }
}