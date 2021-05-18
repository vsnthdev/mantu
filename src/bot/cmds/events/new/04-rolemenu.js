/*
 *  Add the newly created role to the role menu.
 *  Created On 13 May 2021
 */

import { getRoleMessage } from '../../rolemenu/add/index.js'

export default async ({ name, emoji }) => {
    const msg = await getRoleMessage()
    let { content } = msg

    content = content.split('\n')
    content.splice(content.length - 2, 0, `> ${emoji}  ➜  ${name}`)
    await msg.edit(content.join('\n'))
}
