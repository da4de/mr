import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { catchError, firstValueFrom, Observable, Subject, tap, timer } from "rxjs";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { StocksSearchQueryDTO } from "./dto/stocks-search.query.dto";
import { StocksSearchResult } from "./dto/stocks-search.response";
import { MarketStatusQueryDTO } from "./dto/market-status.query.dto";
import { MarketStatus } from "./dto/market-status.response";
import { ConfigService } from "@nestjs/config";

/**
 * Provider spicific stocks information service
 */
@Injectable()
export class FinnhubService {
    private finnhubHttp: string;
    private finnhubWS: string;
    private finnhubApiKey: string;

    private tokenHeader: Record<string, string>;

    private searchUrl: string;
    private marketStatusUrl: string;

    /** Subject that communicates with the Finnhub server via WebSocket */
    private socket$: WebSocketSubject<any>;
    private messages$ = new Subject<any>();

    private subscriptions = new Set<string>();

    constructor(private readonly httpService: HttpService, private configService: ConfigService) {
        const finnhubHttp = this.configService.get<string>('finnhub.address')
        const finnhubWS = this.configService.get<string>('finnhub.wsAddress')
        const finnhubApiKey = this.configService.get<string>('finnhub.apiKey')

        if (!finnhubHttp || !finnhubWS || !finnhubApiKey) {
            throw new Error(`FinnhubService: ConfigService: Missing required config: "finnhub.address", "finnhub.wsAddress" or "finnhub.apiKey"`)
        }

        this.finnhubHttp = finnhubHttp;
        this.finnhubWS = finnhubWS;
        this.finnhubApiKey = finnhubApiKey;

        this.tokenHeader = { "X-Finnhub-Token": this.finnhubApiKey };

        this.searchUrl = `${this.finnhubHttp}/api/v1/search`;
        this.marketStatusUrl = `${this.finnhubHttp}/api/v1/stock/market-status`;

        this.webSocketConnect();
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

    /** Opening connection to the Finnhub WebSocket server */
    private webSocketConnect() {
        this.socket$ = webSocket({
            url: `${this.finnhubWS}?token=${this.finnhubApiKey}`,
            openObserver: {
                next: () => {
                    console.log('Server connected with Finnhub through WebSocket');
                    /* Subscribes if the subscriptions set is not empty */
                    this.subscriptions.forEach((symbol) => this.subscribe(symbol))
                }
            },
            closeObserver: {
                next: () => console.log('Server disconnected from Finnhub through WebSocket')
            }
        });

        this.socket$
            .subscribe({
                next: (msg) => this.messages$.next(msg),
                error: (error) => {
                    if (error?.type === 'close') {
                        console.warn('Close event received from Finnhub');
                    } else {
                        console.error('Finnhub WebSocket error:', error);
                    }
                    console.warn('Connection will be recreated');
                    this.webSocketReconnect();
                },
                complete: () => {
                    console.log('WebSocket connection closed');
                }
            })
    }

    /** Reopening connection to the Finnhub WebSocket server */
    private webSocketReconnect() {
        this.closeConnection();
        timer(5000).subscribe(() => {
            this.webSocketConnect();
        })
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
        return this.messages$.asObservable();
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
        this.subscriptions.add(symbol);
        this.sendMessage({ type: 'subscribe', symbol })
    }

    /** Sends unsubscription message to finnhub WebSocket connection */
    unsubscribe(symbol: string) {
        this.subscriptions.delete(symbol);
        this.sendMessage({ type: 'unsubscribe', symbol })
    }

    /** Closes the WebSocket connection */
    closeConnection() {
        this.socket$.complete()
    }
}
