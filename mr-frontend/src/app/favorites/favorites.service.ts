import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Ticker } from "../search/components/search-ticker/search.model";

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private localStorageKey='favorites-tickers';
    private favoritesSubject = new BehaviorSubject<Ticker[]>(this.loadFavorites())

    favorites$ = this.favoritesSubject.asObservable();

    private loadFavorites() {
        const data = localStorage.getItem(this.localStorageKey);
        return data ? JSON.parse(data) : []
    }

    private save(favorites: Ticker[]) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(favorites))
        this.favoritesSubject.next(favorites);
    }

    add(ticker: Ticker) {
        if (!this.isFavorite(ticker.ticker)) {
            const favorites = this.favoritesSubject.getValue();
            favorites.push(ticker)
            this.save(favorites);
        }
    }

    delete(ticker: Ticker['ticker']) {
        if (this.isFavorite(ticker)) {
            let favorites = this.favoritesSubject.getValue();
            favorites = favorites.filter(item => item.ticker !== ticker)
            this.save(favorites);
        }
    }

    isFavorite(ticker: Ticker['ticker']) {
        return ~this.favoritesSubject.getValue().findIndex(item => item.ticker === ticker)
    }
}