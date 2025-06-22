import { StockPrices } from "./prices.model";

/**
 * Calculates average prices for stocks based on buffered price data
 * @param buffer Array of stock price objects 
 * @returns Object containing average prices per stock
 */
export function calcAveragePriceFromBuffer(buffer: StockPrices[]) {
    const sumAndCount: { [key: string]: { sum: number, count: number } } = {}

    buffer.forEach(priceObject => {
        for (const [key, values] of Object.entries(priceObject)) {
            let { sum = 0, count = 0 } = sumAndCount[key] || {};
            sumAndCount[key] = { sum: sum + values.price, count: count + 1 };
        }
    })

    const result: StockPrices = {}
    for (const [key, values] of Object.entries(sumAndCount)) {
        result[key] = { price: values.sum / values.count, time: Date.now() }
    }

    return result;
}