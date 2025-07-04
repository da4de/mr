/** Stock Prices Finnhub format */
export interface FinnhubStockPrices {
    data ?: {
        /** Symbol */
        s: string;
        /** Last price */
        p: number;
        /** UNIX milliseconds timestamp */
        t: number;
    }[]
}