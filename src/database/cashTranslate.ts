// This file will deal with all the data in the cashTranslate table

import database from './database'

export interface CashTranslate {
    code: string;
    value: string;
}

async function addCashTranslation(code, value): Promise<void> {
    return await database('cashTranslate')
        .insert({ code, value })
}

async function resetCashTranslation(): Promise<void> {
    await database('cashTranslate')
        .del()
}

async function getRates(): Promise<any> {
    return await database('cashTranslate')
}

export default {
    addCashTranslation,
    resetCashTranslation,
    getRates
}