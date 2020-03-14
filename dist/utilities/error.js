"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(promiseToHandle) {
    return new Promise(resolve => {
        promiseToHandle
            .catch(e => {
            resolve({
                e
            });
        })
            .then(data => {
            resolve({
                data
            });
        });
    });
}
exports.errorHandler = errorHandler;
