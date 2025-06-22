/** Parameters for stock search */
export interface StocksSearchParams {
    /** Search input string */
    search: string,
}

/** Represents a stock */
export interface Stock {
    /** Stock type */
    type: string,
    /** Unique stock identifier (ticker symbol)*/
    symbol: string,
    /** Symbol display name */
    displaySymbol: string,
    /** Full name or description of the stock */
    description: string,
}

/** Alias for a stock's ticker symbol */
export type Ticker = Stock['symbol']