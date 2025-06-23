/** Market status response */
export class MarketStatus {
    /** Exchange */
    exchange: string;
    /** Holiday event */
    holiday: string;
    /** Whether the market is open at the moment */
    isOpen: boolean;
    /** Market session. Can be 1 of the following values: pre-market,regular,post-market or null if the market is closed */
    session: string;
    /** Current timestamp */
    t: number;
    /** Timezone */
    timezone: string;
}
