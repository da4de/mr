import { Injectable } from "@angular/core";
import { StocksSearchParams, Stock } from "../../features/stock-search-form/stock-search.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, catchError, filter, of, switchMap } from "rxjs";
import { ApiCountedResponse } from "../types/response.types";

/**
 * Service for searching stocks.
 * Handles search parameters and exposes the latest search results.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
    /** URL for retrieving stock search results*/
    private searchUrl = '/stocks/search';

    /** Subject holding the current search parameters */
    private searchParamsSubject = new BehaviorSubject<StocksSearchParams>({search: ''});

    /** Observable exposing the current search parameters */
    readonly searchParams$ = this.searchParamsSubject.asObservable();
    
    /** Subject holding the latest search results */
    private searchResultsSubject = new BehaviorSubject<Stock[]>([])

    /** Observable exposing the latest search results */
    readonly searchResults$ = this.searchResultsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.searchParamsSubject
            .pipe(
                filter(params => !!params.search.length),
                switchMap(query => {
                    const params = new HttpParams().set('q', query.search)
                    return this.http.get<ApiCountedResponse<Stock[]>>(this.searchUrl, { params })
                        .pipe(catchError(err => {
                            console.error(err);
                            return of({ count: 0, result: [] });
                        }))
                })
            ).subscribe(
                ({ result }) => this.searchResultsSubject.next(result)
            )
    }

    /**
     * Updates the current search parameters
     * @param searchParams The new search parameters
     */
    updateSearchParams(searchParams: StocksSearchParams) {
        this.searchParamsSubject.next(searchParams);
    }
}