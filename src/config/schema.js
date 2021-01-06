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
            name: Joi.string().required(),
            username: Joi.string().required(),
            password: Joi.string().allow(null).required(),
        }),
        redis: Joi.object({
            host: Joi.string().required(),
            port: Joi.number().min(1000).max(60000).required(),
            channel: Joi.number().min(1).max(99).required(),
            password: Joi.string().allow(null).required(),
        }),
    }),
    server: Joi.object({
        host: Joi.string().required(),
        port: Joi.number().min(1000).max(60000).required(),
    }),
    discord: Joi.object({
        token: Joi.string().length(59).required(),
        prefix: Joi.string().required(),
        server: Joi.string().length(18).required(),
        tasks: Joi.object({
            syncMembers: Joi.string().required(),
        }),
    }),
})
