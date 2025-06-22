import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ExchangeEnum, MarketStatus, MarketStatusQuery } from "./market-status.model";

/**
 * Service for retrieving current market status and triggering simulations when the market is closed.
 */
@Injectable({ providedIn: 'root' })
export class StatusService {
    /** URL for retrieving market status */
    private marketStatusUrl = '/stocks/status'
    /** URL for triggering market simulation */
    private generationUrl = '/stocks/generation'

    constructor(private http: HttpClient) { }

    /**
     * Retrieves the current market status
     * @param query Optional query parameters (defaults to US exchange)
     * @returns An observable emitting the market status 
     */
    getMarketStatus(query?: MarketStatusQuery): Observable<MarketStatus> {
        const params = new HttpParams().set('exchange', query?.exchange || ExchangeEnum.US)
        return this.http.get<MarketStatus>(this.marketStatusUrl, { params })
    }

    /**
     * Triggers a stock market simulation
     * Only applies to selected tickers: TSLA, AMZN, AAPL, MSFT
     */
    generation(): Observable<void> {
        return this.http.get<void>(this.generationUrl)
    }
}