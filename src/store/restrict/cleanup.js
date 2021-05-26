/*
 *  Remove those entries that don't have a command.
 *  Created On 25 May 2021
 */

const cleanCommandGroups = async cmds => {
    const toBeRemoved = []

    for (const cmd of cmds) {
        const matched = cmds.filter(c => c.name.startsWith(cmd.name)).length

        if (matched > 1) toBeRemoved.push(cmd)
    }

    return cmds.filter(cmd => !toBeRemoved.includes(cmd))
}

export default async (restrict, cmds) => {
    cmds = await cleanCommandGroups(cmds)
    cmds = cmds.map(cmd => cmd.name)

    const toBeRemoved = Object.keys(restrict.store).filter(
        cmd => !cmds.includes(cmd),
    )

    for (const name of toBeRemoved) restrict.delete(name)
}
