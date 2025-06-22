import { Ticker } from "../../features/stock-search-form/stock-search.model";

/** Stock prices mapped by ticker symbol */
export interface StockPrices {
    [key: Ticker]: { price: number, time: number }
}