/*
 *  Outputs description into the text channel of the newly
 *  created event.
 *  Created On 13 May 2021
 */

const getFormat = (original, converted) =>
    original.toFormat('d') == converted.toFormat('d')
        ? 'h:mm a'
        : 'LLL d, yyyy h:mm a'

const getZoneName = time =>
    time
        .toFormat('ZZZZZ')
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()

export default async ({ text, time }) => {
    // timezones
    const est = time.setZone('America/New_York')
    const gmt = time.setZone('Europe/London')
    const cest = time.setZone('Europe/Paris')
    const jst = time.setZone('Asia/Tokyo')

    // construct the timings
    const timings = [
        `${time.toFormat('LLL d, yyyy')} ${time.toFormat(
            'h:mm a',
        )} (${getZoneName(time)})`,
        `${est.toFormat(getFormat(time, est))} (${getZoneName(est)})`,
        `${gmt.toFormat(getFormat(time, gmt))} (${getZoneName(gmt)})`,
        `${cest.toFormat(getFormat(time, cest))} (${getZoneName(cest)})`,
        `${jst.toFormat(getFormat(time, jst))} (${getZoneName(jst)})`,
    ]

    // send the event description to the text channel
    // eslint-disable-next-line no-irregular-whitespace
    await text.setTopic(`:clock4: ${timings.join(' ｜ ')}`)
}
