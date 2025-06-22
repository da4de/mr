import { Injectable } from "@angular/core";
import { SearchTickerParams, Ticker } from "../search/components/search-ticker/search.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, catchError, filter, Observable, of, switchMap } from "rxjs";
import { ApiCountedResponse } from "../common/types";

@Injectable({ providedIn: 'root' })
export class SearchService {
    private searchUrl = '/stocks/search';

    private searchParamsSubject = new BehaviorSubject<SearchTickerParams>(new SearchTickerParams(''));
    readonly searchParams$ = this.searchParamsSubject.asObservable();

    private searchResultsSubject = new BehaviorSubject<Ticker[]>([])
    readonly searchResults$ = this.searchResultsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.searchParamsSubject
            .pipe(
                filter(params => !!params.search.length),
                switchMap(query => {
                    const params = new HttpParams().set('q', query.search)
                    return this.http.get<ApiCountedResponse<Ticker[]>>(this.searchUrl, { params })
                        .pipe(catchError(err => {
                            console.error(err);
                            return of({ count: 0, result: [] });
                        }))
                })
            ).subscribe(
                ({ result }) => this.searchResultsSubject.next(result)
            )
    }

    updateSearchParams(searchParams: SearchTickerParams) {
        this.searchParamsSubject.next(searchParams);
    }
}