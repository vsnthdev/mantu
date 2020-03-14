// This file will contains utility functions that handle errors

export function errorHandler(promiseToHandle: Promise<any>): Promise<any> {
    return new Promise(resolve => {
        promiseToHandle
            .catch(e => {
                resolve({
                    e
                })
            })
            .then(data => {
                resolve({
                    data
                })
            })
    })
}