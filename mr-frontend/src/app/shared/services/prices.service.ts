import { Injectable } from "@angular/core";
import { WebSocketService } from "../../core/services/websocket.service";
import { Ticker } from "../../features/stock-search-form/stock-search.model";
import { BehaviorSubject, bufferTime, map, Observable } from "rxjs";
import { StockPrices } from "./prices.model";
import { calcAveragePriceFromBuffer } from "./prices.utils";

/**
 * Service for subscribing to stock prices and retrieving real-time and averaged price data
 */
@Injectable({ providedIn: 'root' })
export class PricesService {
    /** Subject holding the latest stock prices for subscribed tickers */
    private actualPriceSubject = new BehaviorSubject<StockPrices>({})

    constructor(private webSocketService: WebSocketService) {
        this.webSocketService.getMessage().subscribe(
            this.onWebSocketServiceMessage
        );
    }

    /**
     * Handles messages received from the server via WebSocket
     * @param message Incoming message from the server
     */
    onWebSocketServiceMessage = (message: any) => {
        if (message?.type === 'price') {
            const { ticker, price, time } = message;
            this.actualPriceSubject.next({ [ticker]: { price: price, time: time } });
        }
    }

    /**
     * Subscribes to price updates for the given ticker symbol
     * @param symbol The stock ticker to subscribe to
     */
    subscribe(symbol: Ticker) {
        this.webSocketService.sendMessage({ type: 'subscribe', symbol });
    }

    /**
     * Unsubscribes from price updates for the given ticker symbol
     * @param symbol The stock ticker to unsubscribe from
     */
    unsubscribe(symbol: Ticker) {
        this.webSocketService.sendMessage({ type: 'unsubscribe', symbol });
        const actualPrice = { ...this.actualPriceSubject.getValue() };
        delete actualPrice[symbol];
        this.actualPriceSubject.next(actualPrice);
    }

    /**
     * Returns an observable emitting the latest prices for all subscribed tickers
     * @returns Observable of stock prices
     */
    getActualPrice(): Observable<StockPrices> {
        return this.actualPriceSubject.asObservable()
    }

    /**
     * Returns an observable that emits the average prices of subscribed stocks,
     * calculated over the specified buffer time span.
     * @param bufferTimeSpan Time span in milliseconds for collecting price data
     * @returns Observable of average stock prices
     */
    getAveragePrice(bufferTimeSpan: number): Observable<StockPrices> {
        return this.actualPriceSubject.pipe(
            bufferTime(bufferTimeSpan),
            map(calcAveragePriceFromBuffer)
        )
    }
}
