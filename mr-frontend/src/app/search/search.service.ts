import { Injectable } from "@angular/core";
import { SearchTickerParams, SearchTickerResult } from "./components/search-ticker/search.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, catchError, filter, Observable, of, switchMap } from "rxjs";
import { ApiResponse } from "../common/types";

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private searchParams$ = new BehaviorSubject<SearchTickerParams>(new SearchTickerParams(''));
    private searchResults$ = new BehaviorSubject<SearchTickerResult[]>([])

    constructor(private http: HttpClient) {
        this.searchParams$
            .pipe(
                filter(params => !!params.search.length),
                switchMap(params =>
                    this.http.get<ApiResponse<SearchTickerResult[]>>(`/stocks/tickers?search=${encodeURIComponent(params.search)}`)
                    .pipe(catchError(err => {
                        console.error(err);
                        return of({results: []});
                    }))
                )
            ).subscribe(
                ({ results }) => this.searchResults$.next(results)
            )
    }

    updateSearchParams(searchParams: SearchTickerParams) {
        console.log('updateSearchParams', searchParams)
        this.searchParams$.next(searchParams);
    }

    getSearchResults(): Observable<SearchTickerResult[]> {
        return this.searchResults$.asObservable();
    }
}