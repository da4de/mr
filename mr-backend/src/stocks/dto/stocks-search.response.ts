/** Stock search result item */
export class Stock {
    /** Stock type */
    type: string;
    /** Unique stock identifier (ticker symbol)*/
    symbol: string;
    /** Symbol display name */
    displaySymbol: string;
    /** Full name or description of the stock */
    description: string
}

/** Stocks search response  */
export class StocksSearchResult {
    /** Result count */
    count: number;
    result: Stock[];
}
