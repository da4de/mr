export class SearchTickerParams {
    constructor(
        public search: string,
    ) { }
}

export class SearchTickerResult {
    constructor(
        public ticker: string,
        public name: string,
        public market: string,
        public locale: string,
        public primary_exchange: string,
        public type: string,
        public active: boolean,
        public currency_name: string,
        public cik: string,
        public composite_figi: string,
        public share_class_figi: string,
        public last_updated_utc: string,
    ) { }
}

export class Ticker {
    constructor(
        public ticker: string,
        public name: string,
        public market: string,
        public locale: string,
        public primary_exchange: string,
        public type: string,
        public active: boolean,
        public currency_name: string,
        public cik: string,
        public composite_figi: string,
        public share_class_figi: string,
        public last_updated_utc: string,
    ) { }
}