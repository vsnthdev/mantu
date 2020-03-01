// This file will handle any output messages to stdout

import itivrutaha from 'itivrutaha'

const logger = itivrutaha.createNewLogger({
    theme: ':type :message'
})

export default logger