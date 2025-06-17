import { Injectable } from "@angular/core";
import { SearchTickerParams, Ticker } from "./components/search-ticker/search.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, catchError, filter, Observable, of, switchMap } from "rxjs";
import { ApiResponse } from "../common/types";

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private searchParams$ = new BehaviorSubject<SearchTickerParams>(new SearchTickerParams(''));
    private searchResultsSubject = new BehaviorSubject<Ticker[]>([])

    constructor(private http: HttpClient) {
        this.searchParams$
            .pipe(
                filter(params => !!params.search.length),
                switchMap(params =>
                    this.http.get<ApiResponse<Ticker[]>>(`/stocks/tickers?q=${encodeURIComponent(params.search)}`)
                    .pipe(catchError(err => {
                        console.error(err);
                        return of({result: []});
                    }))
                )
            ).subscribe(
                ({ result }) => this.searchResultsSubject.next(result)
            )
    }

    updateSearchParams(searchParams: SearchTickerParams) {
        this.searchParams$.next(searchParams);
    }

    getSearchResults(): Observable<Ticker[]> {
        return this.searchResultsSubject.asObservable();
    }
}