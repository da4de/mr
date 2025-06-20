import { Injectable } from "@angular/core";
import { BehaviorSubject, map, pairwise } from "rxjs";
import { Ticker } from "../search/components/search-ticker/search.model";

function difference<T>(a: Set<T>, b: Set<T>): Set<T> {
    return new Set([...a].filter(x => !b.has(x)));
}

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private localStorageFavoritesTickersKey = 'favorites-tickers';
    private localStorageSubscriptionsTickersKey = 'subscriptions-tickers';

    private favoritesSubject = new BehaviorSubject<Ticker[]>(this.loadFavorites())
    private subscriptionsSubject = new BehaviorSubject<Set<Ticker['symbol']>>(new Set())

    favorites$ = this.favoritesSubject.asObservable();

    constructor() {
        const subscriptions = this.loadSubscriptions();
        this.subscriptionsSubject.next(new Set(subscriptions));
    }

    private loadFavorites() {
        const data = localStorage.getItem(this.localStorageFavoritesTickersKey);
        return data ? JSON.parse(data) : []
    }

    private loadSubscriptions() {
        const data = localStorage.getItem(this.localStorageSubscriptionsTickersKey);
        return data ? new Set<Ticker['symbol']>(JSON.parse(data)) : new Set<Ticker['symbol']>()
    }

    private save(favorites: Ticker[]) {
        localStorage.setItem(this.localStorageFavoritesTickersKey, JSON.stringify(favorites))
        this.favoritesSubject.next(favorites);
    }

    private saveSubscriptions(subscriptions: Set<Ticker['symbol']>) {
        localStorage.setItem(this.localStorageSubscriptionsTickersKey, JSON.stringify([...subscriptions]))
        this.subscriptionsSubject.next(subscriptions);
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

            this.unsubscribe(ticker);
        }
    }

    isFavorite(ticker: Ticker['symbol']) {
        return !!~this.favoritesSubject.getValue().findIndex(item => item.symbol === ticker)
    }

    getFavorities() {
        return this.favoritesSubject.asObservable();
    }

    subscribe(ticker: Ticker['symbol']) {
        const subscriptions = new Set(this.subscriptionsSubject.getValue())
        subscriptions.add(ticker)
        this.saveSubscriptions(subscriptions);
    }

    unsubscribe(ticker: Ticker['symbol']) {
        const subscriptions = new Set(this.subscriptionsSubject.getValue())
        subscriptions.delete(ticker)
        this.saveSubscriptions(subscriptions);
    }

    subscriptions() {
        return this.subscriptionsSubject.pipe(
            map(values => Array.from(values))
        )
    }

    subscribed() {
        return this.subscriptionsSubject.pipe(
            pairwise(),
            map(([prev, curr]) => difference(curr, prev)),
            map(diffSet => Array.from(diffSet))
        )
    }

    unsubscribed() {
        return this.subscriptionsSubject.pipe(
            pairwise(),
            map(([prev, curr]) => difference(prev, curr)),
            map(diffSet => Array.from(diffSet))
        )
    }

    isChartTicker(ticker: Ticker['symbol']) {
        return this.subscriptionsSubject.getValue().has(ticker)
    }
}