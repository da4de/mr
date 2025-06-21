import { Injectable } from "@angular/core";
import { WebSocketService } from "../common/services/websocket.service";
import { Ticker } from "../search/components/search-ticker/search.model";
import { BehaviorSubject, bufferTime, map, Observable } from "rxjs";

export interface ITickerPrices {
    [key: Ticker['symbol']]: { price: number, time: number }
}

export interface ITickerAvgPrice {
    [key: Ticker['symbol']]: { price: number }
}

@Injectable({
    providedIn: 'root'
})
export class PricesService {
    private subscriptions: Set<Ticker['symbol']> = new Set()

    private actualPriceSubject = new BehaviorSubject<ITickerPrices>({})

    constructor(private webSocketService: WebSocketService) {
        this.webSocketService.getMessage().subscribe(
            this.onWebSocketServiceMessage
        );
    }

    onWebSocketServiceMessage = (message: any) => {
        if (message?.type === 'price') {
            const { ticker, price, time } = message;
            this.actualPriceSubject.next({[ticker]: { price: price, time: time }});
        }
    }

    subscribe(symbol: Ticker['symbol']) {
        this.webSocketService.sendMessage({ type: 'subscribe', symbol });
        this.subscriptions.add(symbol);
    }

    unsubscribe(symbol: Ticker['symbol']) {
        this.webSocketService.sendMessage({ type: 'unsubscribe', symbol });
        this.subscriptions.delete(symbol);
        const actualPrice = this.actualPriceSubject.getValue();
        delete actualPrice[symbol];
        this.actualPriceSubject.next(actualPrice);
    }

    getSubscriptions() {
        return Array.from(this.subscriptions)
    }

    calcAveragePriceFromBuffer(buffer: ITickerPrices[]) {
        const sumAndCount: { [key: string]: { sum: number, count: number } } = {}
        buffer.forEach(priceObject => {
            for (const [key, values] of Object.entries(priceObject)) {
                let { sum = 0, count = 0 } = sumAndCount[key] || {};
                sum += values.price;
                count += 1
                sumAndCount[key] = { sum, count };
            }
        })

        const result: ITickerPrices = {}
        for (const [key, values] of Object.entries(sumAndCount)) {
            result[key] = { price: values.sum / values.count, time: Date.now() }
        }

        return result;
    }

    getActualPrice() {
        return this.actualPriceSubject.asObservable()
    }

    getAveragePrice(bufferTimeSpan: number): Observable<ITickerPrices> {
        return this.actualPriceSubject.pipe(
            bufferTime(bufferTimeSpan),
            map(this.calcAveragePriceFromBuffer)
        )
    }
}
