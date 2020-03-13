// This file loads different response templates from the filesystem

import fs from 'fs'
import path from 'path'

export default async function load(name: string): Promise<string> {
    // construct the templates directory path
    const templatesDirPath = path.join(process.cwd(), 'templates', `${name}.txt`)

    // read the file and return the text
    return (await fs.promises.readFile(templatesDirPath, { encoding: 'UTF-8' })) as string
}