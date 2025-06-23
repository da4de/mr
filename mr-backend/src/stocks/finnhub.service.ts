import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, firstValueFrom, Observable, tap } from "rxjs";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { StocksSearchQueryDTO } from "./dto/stocks-search.query.dto";
import { StocksSearchResult } from "./dto/stocks-search.response";
import { MarketStatusQueryDTO } from "./dto/market-status.query.dto";
import { MarketStatus } from "./dto/market-status.response";

/**
 * Provider spicific stocks information service
 */
@Injectable()
export class FinnhubService {
    /* TODO add to config service */
    private finnhubHttp = process.env.FINNHUB_ADDRESS;
    private finnhubWS = process.env.FINNHUB_WS_ADDRESS;
    private finnhubApiKey = process.env.FINNHUB_API_KEY;

    private tokenHeader = { "X-Finnhub-Token": this.finnhubApiKey }

    private searchUrl = `${this.finnhubHttp}/api/v1/search`
    private marketStatusUrl = `${this.finnhubHttp}/api/v1/stock/market-status`

    /** Subject that communicates with the Finnhub server via WebSocket */
    private socket$: WebSocketSubject<any>;

    constructor(private readonly httpService: HttpService) {
        this.socket$ = webSocket(`${this.finnhubWS}?token=${this.finnhubApiKey}`);
    }

    /** Search stocks by query parameters */
    async search(query: StocksSearchQueryDTO): Promise<StocksSearchResult> {
        const { data } = await firstValueFrom(
            this.httpService.get<StocksSearchResult>(this.searchUrl, { params: query, headers: this.tokenHeader })
                .pipe(
                    catchError((error: AxiosError) => {
                        console.error('Error. Stocks search request.', error.response?.data);
                        throw error;
                    })
                ))
        return data
    }

    /** Retrieve current market status  */
    async status(query: MarketStatusQueryDTO): Promise<MarketStatus> {
        const { data } = await firstValueFrom(
            this.httpService.get<MarketStatus>(this.marketStatusUrl, { params: query, headers: this.tokenHeader })
                .pipe(
                    catchError((error: AxiosError) => {
                        console.error('Error. Market status request.', error.response?.data);
                        throw error;
                    })
                )
        )
        return data
    }

    /**
     * Sends a message to the server through the WebSocket connection
     * @param message The message to send
     */
    private sendMessage(message: any) {
        console.log('Message to finnhub:', message)
        this.socket$.next(message);
    }

    /**
     * Returns an observable that emits messages received from the server
     * @returns Observable of incoming messages
     */
    private getMessage(): Observable<any> {
        return this.socket$.asObservable();
    }

    /** 
     * Retrieves an Observable providing all messages from Finnhub WebSocket connection.
     * Additionally logs incoming messages to the console.
     */
    messagesFromStockMarket(): Observable<any> {
        return this.getMessage().pipe(
            tap((message) => console.log('Message from finnhub:', message))
        );
    }

    /** Sends subscription message to finnhub WebSocket connection */
    subscribe(symbol: string) {
        this.sendMessage({ type: 'subscribe', symbol })
    }

    /** Sends unsubscription message to finnhub WebSocket connection */
    unsubscribe(symbol: string) {
        this.sendMessage({ type: 'unsubscribe', symbol })
    }

    /** Closes the WebSocket connection */
    closeConnection() {
        this.socket$.complete()
    }
}
