import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map } from "rxjs";
import { Stock, Ticker } from "../stock-search-form/stock-search.model";
import { LocalStorageService } from "../../core/services/local-storage.service";
import { LocalStorageKeys } from "../../shared/constants/local-storage.keys";
import { SubscriptionsService } from "../../shared/services/subscriptions.service";
import { isNonEmptyString, jsonParseArray } from "../../shared/utils/helpers";

/**
 * Service for managing the list of favorite stocks
 */
@Injectable({ providedIn: 'root' })
export class FavoriteService {
    /** Subject holding the list of favorite stocks */
    private favoritesSubject = new BehaviorSubject<Stock[]>([]);
    /** Observable exposing the current list of favorite stocks */
    readonly favorites$ = this.favoritesSubject.asObservable();

    constructor(
        private localStorageService: LocalStorageService,
        private subscriptionsService: SubscriptionsService
    ) {
        /* Watch the "FavoriteStocks" key in localStorage */
        localStorageService.watch(LocalStorageKeys.FavoriteStocks).pipe(
            filter(isNonEmptyString),
            map(jsonParseArray<Stock>)
        ).subscribe(value => this.favoritesSubject.next(value))
    }

    /**
     * Saves the list of favorite stocks to localStorage
     * @param favorites The updated favorites list
     */
    private saveFavorites(favorites: Stock[]) {
        this.localStorageService.setItem(
            LocalStorageKeys.FavoriteStocks,
            JSON.stringify(favorites)
        )
    }

    /**
     * Adds a stock to the favorites list if it's not already present
     * @param stock The stock to add
     */
    addFavorite(stock: Stock) {
        if (!this.isFavorite(stock.symbol)) {
            const favorites = [...this.favoritesSubject.getValue(), stock]
            this.saveFavorites(favorites);
        }
    }

    /**
     * Removes a stock from the favorites list by its ticker symbol
     * @param ticker The ticker symbol to remove 
     */
    deleteFavorite(ticker: Ticker) {
        if (this.isFavorite(ticker)) {
            const updatedFavorites = this.favoritesSubject
                .getValue()
                .filter(item => item.symbol !== ticker)
            this.saveFavorites(updatedFavorites);
            this.subscriptionsService.unsubscribe(ticker);
        }
    }

    /**
     * Checks whether the given stock ticker is in the favorites list
     * @param ticker The ticker symbol to check
     * @returns True if the ticker is in the favorites list
     */
    isFavorite(ticker: Ticker) {
        return this.favoritesSubject.getValue().some(item => item.symbol === ticker)
    }
}