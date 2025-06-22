import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ExchangeEnum, IMarketStatus, IMarketStatusQuery } from "../status/status.model";

@Injectable({ providedIn: 'root' })
export class StatusService {
    private marketStatusUrl = '/stocks/status'
    private generationUrl = '/stocks/generation'

    constructor(private http: HttpClient) { }

    getMarketStatus(query?: IMarketStatusQuery): Observable<IMarketStatus> {
        const params = new HttpParams().set('exchange', query?.exchange || ExchangeEnum.US)
        return this.http.get<IMarketStatus>(this.marketStatusUrl, { params })
    }

    generation() {
        return this.http.get(this.generationUrl)
    }
}