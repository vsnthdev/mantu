// This file returns the help message to be displayed to the user

import commandLineUsage from 'command-line-usage'

import { optionList } from '../cli'

// the definition object to tell command-line-usage how the
// help message should be formatted and shown to the user
const sections = [
    {
        header: 'mantu',
        content: 'A Discord bot to manage Vasanth Developer server.'
    },
    {
        header: 'Synopsis',
        content: [
            '$ mantu --verbose'
        ]
    },
    {
        header: 'App Options',
        group: '_none',
        optionList
    }
]

export default commandLineUsage(sections)