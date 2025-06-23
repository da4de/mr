import { Injectable } from "@nestjs/common";
import { StocksSearchResult } from "./dto/stocks-search.response";
import { StocksSearchQueryDTO } from "./dto/stocks-search.query.dto";
import { MarketStatusQueryDTO } from "./dto/market-status.query.dto";
import { MarketStatus } from "./dto/market-status.response";
import { FinnhubService } from "./finnhub.service";

/**
 * Stocks service
 */
@Injectable()
export class StocksService {
    /** Map holds client subscriptions */
    clientSubscriptions = new Map<string, Set<WebSocket>>()

    constructor(private readonly finnhubService: FinnhubService) {
        this.finnhubService.messagesFromStockMarket().subscribe(this.onMessageFromMarket)
    }

    /** Search stocks by query parameters */
    async search(query: StocksSearchQueryDTO): Promise<StocksSearchResult> {
        return this.finnhubService.search(query)
    }

    /** Retrieve current market status  */
    async status(query: MarketStatusQueryDTO): Promise<MarketStatus> {
        return this.finnhubService.status(query)
    }

    /** Handler for message from stock market */
    onMessageFromMarket = (message: any) => {
        const { data = [] } = message;
        data.forEach(({ s, p, t }: { s: string, p: number, t: number }) => {
            this.clientSubscriptions.get(s)?.forEach(client => {
                client.send(JSON.stringify({ type: 'price', ticker: s, price: p, time: t }))
            })
        })
    }

    /** Subscribes client to stocks ticker */
    subscribe(client: WebSocket, symbol: string) {
        const clientSet = this.clientSubscriptions.get(symbol) || new Set()
        const isSubscriptionExist = clientSet.size > 0
        
        if (!isSubscriptionExist) {
            this.finnhubService.subscribe(symbol)
        }

        clientSet.add(client)
        this.clientSubscriptions.set(symbol, clientSet);
    }

    /** Unsubscribes client from stocks ticker */
    unsubscribe(client: WebSocket, symbol: string) {
        const clientSet = this.clientSubscriptions.get(symbol) || new Set()
        clientSet.delete(client);

        if (clientSet.size === 0) {
            this.finnhubService.unsubscribe(symbol);
            this.clientSubscriptions.delete(symbol);
        } else {
            this.clientSubscriptions.set(symbol, clientSet);
        }
    }

    /** Unsubscribes client from all tickers */
    unsubscribeAll(client: WebSocket) {
        Array.from(this.clientSubscriptions.keys()).forEach(symbol => {
            this.unsubscribe(client, symbol);
        })
    }

    /**
     * Method only for testing when stock market is closed 
     */
    genId1: NodeJS.Timeout
    genId2: NodeJS.Timeout
    generation() {
        clearInterval(this.genId1);
        clearInterval(this.genId2);
        let aapl = 196.58
        let msft = 480.24
        let tsla = 322.05
        let amzn = 212.52
        function randomizeStockPrice(prevPrice: number, volatility = 0.01): number {
            const changePercent = (Math.random() * 2 - 1) * volatility; // e.g., between -1% and +1%
            const nextPrice = prevPrice * (1 + changePercent);
            return parseFloat(nextPrice.toFixed(2)); // round to 2 decimals
        }

        this.genId1 = setInterval(() => {
            const data = [
                { p: tsla, s: 'TSLA', t: Number((new Date())) },
                { p: amzn, s: 'AMZN', t: Number((new Date())) },
            ]
            tsla = randomizeStockPrice(tsla);
            amzn = randomizeStockPrice(amzn);
            this.onMessageFromMarket({ data });
        }, 1100)

        this.genId2 = setInterval(() => {
            const data = [
                { p: aapl, s: 'AAPL', t: Number((new Date())) },
                { p: msft, s: 'MSFT', t: Number((new Date())) },
            ]
            aapl = randomizeStockPrice(aapl);
            msft = randomizeStockPrice(msft);
            this.onMessageFromMarket({ data });
        }, 700)
    }
}