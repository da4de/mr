/** Supported list of exchange codes */
export enum ExchangeEnum {
    US = 'US'
}

/** Query parameters used to request market status */
export interface MarketStatusQuery {
    exchange: ExchangeEnum
}

/** Represents the current market status */
export interface MarketStatus {
    /** Exchange */
    exchange?: string;
    /** Holiday event */
    holiday?: string;
    /** Whether the market is open at the moment */
    isOpen: boolean;
    /** Market session. Can be 1 of the following values: pre-market,regular,post-market or null if the market is closed */
    session?: string;
    /** Current timestamp */
    t?: number;
    /** Timezone */
    timezone?: string;
}
