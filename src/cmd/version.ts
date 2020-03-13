// This file shows the version of the program and exists with 0

const packageInfo = require('../../package.json')

export default async function showHelp(): Promise<void> {
    console.log(`mantu ${packageInfo.version}`)
}