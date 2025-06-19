import { Injectable } from "@angular/core";
import { WebSocketService } from "../websocket/websocket.service";
import { Ticker } from "../search/components/search-ticker/search.model";
import { BehaviorSubject, buffer, bufferTime, map, Observable, sampleTime } from "rxjs";

export interface ITickerPrice {
    [key: string]: { price: number, time: number }
}

export interface ITickerAvgPrice {
    [key: string]: { price: number }
}

@Injectable({
    providedIn: 'root'
})
export class PricesService {
    private initialTime: number = Number(new Date());
    private subscriptions: Set<Ticker['symbol']> = new Set()

    private actualPriceSubject = new BehaviorSubject<ITickerPrice>({})

    constructor(private webSocketService: WebSocketService) {
        this.webSocketService.getMessage().subscribe(
            this.onWebSocketServiceMessage
        );
    }

    onWebSocketServiceMessage = (message: any) => {
        if (message?.type === 'price') {
            const { ticker, price, time } = message;
            //console.log('WS message', {ticker, price, time})

            const actualPrice = this.actualPriceSubject.getValue();
            actualPrice[ticker] = { price: price, time: time }
            this.actualPriceSubject.next(actualPrice);
        }
    }

    subscribe(symbol: Ticker['symbol']) {
        console.log('subscribe', symbol)
        this.webSocketService.sendMessage({ type: 'subscribe', symbol });
        this.subscriptions.add(symbol);
    }

    unsubscribe(symbol: Ticker['symbol']) {
        console.log('unsubscribe', symbol)
        this.webSocketService.sendMessage({ type: 'unsubscribe', symbol });
        this.subscriptions.delete(symbol);
        const actualPrice = this.actualPriceSubject.getValue();
        delete actualPrice[symbol];
        this.actualPriceSubject.next(actualPrice);
    }

    getSubscriptions() {
        return Array.from(this.subscriptions)
    }

    calcAveragePriceFromBuffer(buffer: ITickerPrice[]) {
        const sumAndCount: { [key: string]: { sum: number, count: number } } = {}
        buffer.forEach(priceObject => {
            for (const [key, values] of Object.entries(priceObject)) {
                let { sum = 0, count = 0 } = sumAndCount[key] || {};
                sum += values.price;
                count += 1
                sumAndCount[key] = { sum, count };
            }
        })

        const result: { [key: string]: { price: number } } = {}
        for (const [key, values] of Object.entries(sumAndCount)) {
            result[key] = { price: values.sum / values.count }
        }

        return result;
    }

    getActualPrice() {
        return this.actualPriceSubject.pipe(
            sampleTime(1000)
        )
    }

    getMinutePrice(): Observable<ITickerAvgPrice> {
        return this.actualPriceSubject.pipe(
            /* TODO change to 60000 */
            bufferTime(10000),
            map(this.calcAveragePriceFromBuffer)
        )
    }

    get15MinutenPrices(): Observable<ITickerAvgPrice> {
        return this.actualPriceSubject.pipe(
            bufferTime(60000 * 15),
            map(this.calcAveragePriceFromBuffer)
        )
    }

}
