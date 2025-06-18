import { Injectable } from "@nestjs/common";
import { ITickers } from "./dto/tickers.result.dto";
import { ITickersQueryDTO } from "./dto/tickers.query.dto";
import { HttpService } from "@nestjs/axios";
import { catchError, firstValueFrom, Timestamp } from "rxjs";
import { AxiosError } from "axios";
import { isSubscription } from "rxjs/internal/Subscription";

@Injectable()
export class StocksService {
    socket: WebSocket;

    subscriptions: { [key: string]: WebSocket[] } = {}

    constructor(private readonly httpService: HttpService) {
        this.socket = new WebSocket(`${process.env.FINNHUB_WS_ADDRESS}?token=${process.env.FINNHUB_API_KEY}`)
        this.socket.addEventListener('open', (event) => {
            console.log('StocksSocket Ready!');
        })
        this.socket.addEventListener('message', this.messageFromMarket);
    }

    async tickers(query: ITickersQueryDTO): Promise<ITickers> {
        /* TODO get process env variables from config service */
        const url = `${process.env.FINNHUB_ADDRESS}/api/v1/search`;
        console.log('StocksService:tickers url', url, query, process.env.FINNHUB_API_KEY)
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

    messageFromMarket = (event: MessageEvent) => {
        console.log('Message from Market ', event.data, JSON.parse(event.data));
        const { data = [] } = JSON.parse(event.data);
        data.forEach(({ s, p, t }: { s: string, p: number, t: number }) => {
            this.subscriptions[s].forEach(client => {
                client.send(JSON.stringify({ ticker: s, price: p, time: t }))
            })
        })
    }

    subscribe(client: WebSocket, symbol: string) {
        console.log('subscribe', symbol)
        const isSubscriptionExist = this.subscriptions[symbol] && Array.isArray(this.subscriptions[symbol]) && !!this.subscriptions[symbol].length;

        if (isSubscriptionExist) {
            if (!this.subscriptions[symbol].includes(client)) {
                console.log('new client')
                this.subscriptions[symbol].push(client);
            }
        } else {
            this.socket.send(JSON.stringify({ type: 'subscribe', symbol }))
            console.log('subscribe for', symbol)
            if (this.subscriptions[symbol]) {
                console.log('new client')
                this.subscriptions[symbol].push(client);
            } else {
                console.log('new client')
                this.subscriptions[symbol] = [client];
            }
        }
    }

    unsubscribe(client: WebSocket, symbol: string) {
        console.log('unsubscribe', symbol)
        const isClientSubscriptionExist = this.subscriptions[symbol] && Array.isArray(this.subscriptions[symbol]) && this.subscriptions[symbol].includes(client);

        if (isClientSubscriptionExist) {
            this.subscriptions[symbol] = this.subscriptions[symbol].filter(client => client !== client)
            if (!this.subscriptions[symbol].length) {
                this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }))
                console.log('unsubscribe for', symbol)
            }
        } else {
            this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }))
            console.log('unsubscribe for', symbol)
        }
    }

    unsubscribeAll(client: WebSocket) {
        console.log('unsubscribeAll')
        Object.keys(this.subscriptions).forEach(symbol => {
            this.subscriptions[symbol] = this.subscriptions[symbol].filter(subscribedClient => subscribedClient !== client)
            if (!this.subscriptions[symbol].length) {
                this.socket.send(JSON.stringify({ type: 'unsubscribe', symbol }))
                console.log('unsubscribe for', symbol)
            }
        })
    }
}