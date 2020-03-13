// This file will handle any output messages to stdout

import itivrutaha from 'itivrutaha'

const logger = itivrutaha.createNewLogger({
    theme: ':type :message',
    verboseIdentifier: ['-V', '--verbose']
})

export default logger