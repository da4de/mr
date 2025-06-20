import { Injectable } from "@nestjs/common";
import { ITickers } from "./dto/tickers.result.dto";
import { ITickersQueryDTO } from "./dto/tickers.query.dto";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom, Timestamp } from "rxjs";
import { AxiosError } from "axios";
import { IMarketStatusQueryDTO } from "./dto/market.status.query.dto";
import { IMarketStatus } from "./dto/market.status.result.dto";

@Injectable()
export class StocksService {
    socket: WebSocket;

    subscriptions: { [key: string]: WebSocket[] } = {}

    constructor(private readonly httpService: HttpService) {
        this.socket = new WebSocket(`${process.env.FINNHUB_WS_ADDRESS}?token=${process.env.FINNHUB_API_KEY}`)
        this.socket.addEventListener('open', (event) => {
            console.log(`${process.env.FINNHUB_WS_ADDRESS} Trading Socket Ready!`);
        })
        this.socket.addEventListener('message', this.onMessageFromMarket);

        /* TODO Testing in holiday*/
        let aapl = 196.58
        let msft = 480.24
        let tsla = 322.05
        let amzn = 212.52
        let brka = 728200.52
        function randomizeStockPrice(prevPrice: number, volatility = 0.01): number {
                const changePercent = (Math.random() * 2 - 1) * volatility; // e.g., between -1% and +1%
                const nextPrice = prevPrice * (1 + changePercent);
                return parseFloat(nextPrice.toFixed(2)); // round to 2 decimals
            }

        setInterval(() => {
            const data = JSON.stringify({
                data: [
                    { p: tsla, s: 'TSLA', t: Number((new Date())) },
                    { p: amzn, s: 'AMZN', t: Number((new Date())) },
                ]
            })
            aapl = randomizeStockPrice(aapl);
            msft = randomizeStockPrice(msft);
            tsla = randomizeStockPrice(tsla);
            amzn = randomizeStockPrice(amzn);
            const message = new MessageEvent('test', { data });
            this.onMessageFromMarket(message);
        }, 1100)

        setInterval(() => {
            const data = JSON.stringify({
                data: [
                    { p: aapl, s: 'AAPL', t: Number((new Date())) },
                    { p: msft, s: 'MSFT', t: Number((new Date())) },
                ]
            })
            aapl = randomizeStockPrice(aapl);
            msft = randomizeStockPrice(msft);
            tsla = randomizeStockPrice(tsla);
            amzn = randomizeStockPrice(amzn);
            const message = new MessageEvent('test', { data });
            this.onMessageFromMarket(message);
        }, 700)
    }

    async tickers(query: ITickersQueryDTO): Promise<ITickers> {
        /* TODO get process env variables from config service */
        const url = `${process.env.FINNHUB_ADDRESS}/api/v1/search`;
        //console.log('StocksService:tickers url', url, query, process.env.FINNHUB_API_KEY)
        const { data } = await firstValueFrom(
            this.httpService.get<ITickers>(url,
                {
                    params: query,
                    headers: { "X-Finnhub-Token": process.env.FINNHUB_API_KEY }
                }).pipe(
                    catchError((error: AxiosError) => {
                        /* TODO handle exceptions properly */
                        console.log(error.response?.data);
                        throw 'An error happened!';
                    })
                )
        )
        return data
    }

    async status(query: IMarketStatusQueryDTO): Promise<IMarketStatus> {
        /* TODO get process env variables from config service */
        const url = `${process.env.FINNHUB_ADDRESS}/api/v1/stock/market-status`;
        const { data } = await firstValueFrom(
            this.httpService.get<IMarketStatus>(url,
                {
                    params: query,
                    headers: { "X-Finnhub-Token": process.env.FINNHUB_API_KEY }
                }).pipe(
                    catchError((error: AxiosError) => {
                        /* TODO handle exceptions properly */
                        console.log(error.response?.data);
                        throw 'An error happened!';
                    })
                )
        )
        return data
    }

    onMessageFromMarket = (event: MessageEvent) => {
        //console.log('Message from Market ', event.data, JSON.parse(event.data));
        const { data = [] } = JSON.parse(event.data);
        data.forEach(({ s, p, t }: { s: string, p: number, t: number }) => {
            this.subscriptions[s]?.forEach(client => {
                //console.log('client send message', { ticker: s, price: p, time: t })
                client.send(JSON.stringify({type: 'price', ticker: s, price: p, time: t }))
            })
        })
    }

    subscribe(client: WebSocket, symbol: string) {
        const isSubscriptionExist = this.subscriptions[symbol] && Array.isArray(this.subscriptions[symbol]) && !!this.subscriptions[symbol].length;

        if (isSubscriptionExist) {
            if (!this.subscriptions[symbol].includes(client)) {
                this.subscriptions[symbol].push(client);
            }
        } else {
            this.socket.send(JSON.stringify({ type: 'subscribe', symbol }))
            if (this.subscriptions[symbol]) {
                this.subscriptions[symbol].push(client);
            } else {
                this.subscriptions[symbol] = [client];
            }
        }
    }

    unsubscribe(client: WebSocket, symbol: string) {
        const isClientSubscriptionExist = this.subscriptions[symbol] && Array.isArray(this.subscriptions[symbol]) && this.subscriptions[symbol].includes(client);

        if (isClientSubscriptionExist) {
            this.subscriptions[symbol] = this.subscriptions[symbol].filter(subscribedClient => subscribedClient !== client)
            if (!this.subscriptions[symbol].length) {
                this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }))
            }
        } else {
            this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }))
        }
    }

    unsubscribeAll(client: WebSocket) {
        Object.keys(this.subscriptions).forEach(symbol => {
            this.subscriptions[symbol] = this.subscriptions[symbol].filter(subscribedClient => subscribedClient !== client)
            if (!this.subscriptions[symbol].length) {
                this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }))
            }
        })
    }
}