/*
 *  This file adds the necessary arguments to the program.
 *  Created On 07 August 2021
 */

export const givenArgs = (...arr) => arr.some(arg => process.argv.includes(arg))

export default program =>
    program
        .option('-V, --verbose', 'show additional 🔬 output')
        .option('-q, --quiet', 'do not 🙅‍♂️ show any output')
