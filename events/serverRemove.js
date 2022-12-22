module.exports = {
    name: 'serverRemove',
    async execute(server, removedBy, client) {
        await server.client.db.delete(server.id)
        client.logChannel.send(`➖ I was removed from ${server.name}`)
    },
};