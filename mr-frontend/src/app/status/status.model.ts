export enum ExchangeEnum {
    US = 'US'
}

export interface IMarketStatusQuery {
    exchange?: ExchangeEnum
}

export interface IMarketStatus {
    exchange?: string;
    holiday: string;
    isOpen: boolean;
    session?: string;
    t?: number;
    timezone?: string;
}
