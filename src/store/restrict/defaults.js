/*
 *  Contains default values for restrictions.
 *  Created On 25 May 2021
 */

export default async restrict => {
    // the set function to not repeat the same code
    const set = (name, value) =>
        restrict.get(name) == undefined ? restrict.set(name, value) : true

    set('lol', ['channel:000000000000000000'])
}
