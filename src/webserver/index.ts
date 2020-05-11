/*
 *  This file will initialize an Express.js webserver and listen for the root route.
 *  When hit by a user, we will create an invite link for the server, and redirect the user
 *  to it.
 *  Created On 11 May 2020
 */

import Conf from 'conf'
import express from 'express'

import { ConfigImpl } from '../config'
import logger from '../logger'
import invites from '../discord/invites'

const web = express()
let localConfig: Conf<ConfigImpl>
let ips = []

export default async function startWebserver(config: Conf<ConfigImpl>): Promise<void> {
    web.listen(config.get('server').port, () => {
        logger.info(`Webserver is ready to handle incoming requests on port ${config.get('server').port}.`)
    })

    localConfig = config

    return
}

async function rateLimit(req: express.Request, res: express.Response, next): Promise<void> {
    const found = ips.find(ip => ip.ip == req.ip.toString())
    if (found) {
        // check if the count is more than 12 and deny the request
        if (found.count > 5) {
            // block him!
            logger.okay(`Rate limited "${req.ip.toString()}".`)
            res.status(429).json({
                error: true,
                message: 'Too many requests.'
            })
        } else {
            // proceed and increment the count
            found.count = found.count + 1
            logger.okay(`Creating an invite link for the "${found.count.toString()}" time from "${req.ip.toString()}".`)
            next()
        }
    } else {
        // register a new ip
        const pushable = {
            ip: req.ip.toString(),
            count: 1
        }

        ips.push(pushable)
        logger.okay(`Creating a new invite for "${req.ip.toString()}".`)
        next()
    }
}

web.get('/', rateLimit, async (req: express.Request, res: express.Response) => {
    res.redirect(await invites.createInvite(localConfig))
})

setTimeout(() => {
    logger.okay('Flushing invite link IPs')
    ips = []
}, (1000 * 60) * 30)