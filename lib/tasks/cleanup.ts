// This file will cleanup the Discord server
// and send people a DM notifying that they have been kicked
// due to inactivity.

import Discord from 'discord.js'

export default function cleanUpServer(config, client: Discord.Client): () => Promise<any> {
    return async function() {
        return
    }
}