// This file contains the following functions:
// sleep()
// setInterval()

export function sleep(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export async function setInterval(interval: number, func): Promise<void> {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        await sleep(interval)
        await func()
    }
}