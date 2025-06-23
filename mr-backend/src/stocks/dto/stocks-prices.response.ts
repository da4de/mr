/** Stock Prices Finnhub format */
export interface FinnhubStockPrices {
    data ?: {
        s: string;
        p: number;
        t: number;
    }[]
}