/*
 *  This file will validate if a command should be loaded or not.
 *  Created On 29 September 2020
 */

import logger from '../../logger/app.js'

export default (cmd, p) => {
    // 1. if the module exports an action
    // 2. warning if there's no description

    if (!cmd.action) return 'An action was not defined.'
    if (!cmd.description)
        logger.warning(
            `A description is recommended for ${
                p.split('src/bot/cmds')[1].substring(1).split('/')[0]
            } command.`,
        )

    // finally add the command's command into the dict
    cmd['name'] = p.split('src/bot/cmds')[1].substring(1).split('/')[0]

    return cmd
}
