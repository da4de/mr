export class SearchTickerParams {
    constructor(
        public search: string,
    ) { }
}

export class Ticker {
    constructor(
        public type: string,
        public symbol: string,
        public displaySymbol: string,
        public description: string,
        public showInChart?: boolean,
    ) { }
}