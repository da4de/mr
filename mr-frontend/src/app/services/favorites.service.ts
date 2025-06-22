import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map } from "rxjs";
import { Ticker } from "../search/components/search-ticker/search.model";
import { LocalStorageService } from "./common/local-storage.service";
import { LocalStorageKeys } from "../constants/local-storage.keys";
import { SubscriptionsService } from "./subscriptions.service";
import { isNonEmptyString, jsonParseArray } from "../common/utils";

@Injectable({ providedIn: 'root' })
export class FavoriteService {
    private favoritesSubject = new BehaviorSubject<Ticker[]>([]);
    readonly favorites$ = this.favoritesSubject.asObservable();

    constructor(private localStorageService: LocalStorageService, private subscriptionsService: SubscriptionsService) {
        localStorageService.watch(LocalStorageKeys.FavoritesTickers).pipe(
            filter(isNonEmptyString),
            map(jsonParseArray<Ticker>)
        ).subscribe(value => this.favoritesSubject.next(value));
    }

    private saveFavorites(favorites: Ticker[]) {
        this.localStorageService.setItem(LocalStorageKeys.FavoritesTickers, JSON.stringify(favorites))
    }

    addFavorite(ticker: Ticker) {
        if (!this.isFavorite(ticker.symbol)) {
            const favorites = [...this.favoritesSubject.getValue(), ticker]
            this.saveFavorites(favorites);
        }
    }

    deleteFavorite(symbol: Ticker['symbol']) {
        if (this.isFavorite(symbol)) {
            const updatedFavorites = this.favoritesSubject
                .getValue()
                .filter(item => item.symbol !== symbol)
            this.saveFavorites(updatedFavorites);
            this.subscriptionsService.unsubscribe(symbol);
        }
    }

    isFavorite(symbol: Ticker['symbol']) {
        return this.favoritesSubject.getValue().some(item => item.symbol === symbol)
    }
}