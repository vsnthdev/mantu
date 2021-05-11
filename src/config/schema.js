/*
 *  This file contains the schema for all settings in the config file.
 *  Created On 06 January 2021
 */

import Joi from 'joi'

export default Joi.object({
    database: Joi.object({
        postgres: Joi.object({
            host: Joi.string().required(),
            port: Joi.number().min(1000).max(60000).required(),
            user: Joi.string().required(),
            database: Joi.string().required(),
            password: Joi.string().allow(null).required(),
        }),
        redis: Joi.object({
            host: Joi.string().required(),
            port: Joi.number().min(1000).max(60000).required(),
            channel: Joi.number().min(0).max(99).required(),
            password: Joi.string().allow(null).required(),
        }),
    }),
    server: Joi.object({
        host: Joi.string().required(),
        port: Joi.number().min(1000).max(60000).required(),
    }),
    discord: Joi.object({
        token: Joi.string().length(59).required(),
        server: Joi.string().length(18).required(),
        invite: Joi.string().required(),
        roles: Joi.object({
            identifer: Joi.object({
                moderator: Joi.string().length(18).required(),
            }),
        }),
        channels: Joi.object({
            settings: Joi.object({
                sep: Joi.string().max(5).required(),
            }),
            positions: Joi.object({
                events: Joi.number().min(0).required(),
            }),
            identifiers: Joi.object({
                logs: Joi.string().length(18).required(),
                invite: Joi.string().length(18).required(),
                showcase: Joi.object({
                    server: Joi.string().length(18).required(),
                }),
            }),
        }),
    }),
})
