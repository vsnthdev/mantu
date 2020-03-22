// This file will import all other interactions and export
// then in a specific structure

import info from './moderation/info'
import clear from './moderation/clear'
import serverStats from './moderation/serverStats'
import help from './moderation/helpMessage'

import serverLink from './utilities/serverInvite'

import github from './github/github'

import timezone from './conversion/timezone'
import country from './conversion/country'
import cash from './conversion/cash'
import time from './conversion/time'

export default {
    moderation: {
        info,
        clear,
        serverStats,
        help
    },
    utilities: {
        serverLink
    },
    github: {
        github
    },
    conversion: {
        timezone,
        country,
        cash,
        time
    }
}