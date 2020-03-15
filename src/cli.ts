// This file will contain the root command

import commandLineArgs from 'command-line-args'

import logger from './logger'

// the definition of all possible arguments
export const optionList = [
    {
        name: 'delay',
        alias: 'D',
        type: Number,
        typeLabel: '{underline <seconds>}',
        default: 0,
        description: 'Wait for number of seconds before starting up.'
    },
    {
        name: 'verbose',
        alias: 'V',
        type: Boolean,
        description: 'Display addition debug information.'
    },
    {
        name: 'version',
        alias: 'v',
        type: Boolean,
        description: 'Show the version information and terminate.'
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Show this help message and terminate.'
    }
]

// parseArgs() returns the parsed arguments using command-line-args
export default async function parseArgs(): Promise<commandLineArgs.CommandLineOptions> {
    try {
        const parsed = commandLineArgs(optionList)
        return parsed
    } catch(err) {
        logger.error(err, 1)
    }
}