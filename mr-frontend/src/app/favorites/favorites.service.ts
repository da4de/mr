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
        if (!this.isFavorite(ticker.symbol)) {
            const favorites = this.favoritesSubject.getValue();
            favorites.push(ticker)
            this.save(favorites);
        }
    }

    delete(ticker: Ticker['symbol']) {
        if (this.isFavorite(ticker)) {
            let favorites = this.favoritesSubject.getValue();
            favorites = favorites.filter(item => item.symbol !== ticker)
            this.save(favorites);
        }
    }

    isFavorite(ticker: Ticker['symbol']) {
        return !!~this.favoritesSubject.getValue().findIndex(item => item.symbol === ticker)
    }
}