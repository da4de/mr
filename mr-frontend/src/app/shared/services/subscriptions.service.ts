import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, pairwise, startWith } from "rxjs";
import { Ticker } from "../../features/stock-search-form/stock-search.model";
import { LocalStorageService } from "../../core/services/local-storage.service";
import { difference, isNonEmptyString, jsonParseSet } from "../utils/helpers";
import { LocalStorageKeys } from "../constants/local-storage.keys";

/**
 * Service for managing the set of subscribed tickers
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
    /** Subject holding the current set of subscribed tickers */
    private subscriptionsSubject = new BehaviorSubject<Set<Ticker>>(new Set());

    /** Observable exposing the set of subscribed tickers */
    readonly subsriptions$ = this.subscriptionsSubject.asObservable();

    constructor(private localStorageService: LocalStorageService) {
        /* Watch the "SubscribedTickers" key in localStorage */
        localStorageService.watch(LocalStorageKeys.SubscribedTickers).pipe(
            filter(isNonEmptyString),
            map(jsonParseSet<Ticker>)
        ).subscribe(value => this.subscriptionsSubject.next(value));
    }

    /**
     * Saves the set of subscribed tickers to localStorage
     * @param subscriptions The updated set of subscribed tickers
     */
    private saveSubscriptions(subscriptions: Set<Ticker>) {
        this.localStorageService.setItem(LocalStorageKeys.SubscribedTickers, JSON.stringify([...subscriptions]))
    }

    /**
     * Adds a ticker to the set of subscribed tickers
     * @param ticker The ticker to subscribe to
     */
    subscribe(ticker: Ticker) {
        const subscriptions = new Set(this.subscriptionsSubject.getValue())
        subscriptions.add(ticker)
        this.saveSubscriptions(subscriptions);
    }

    /**
     * Removes a ticker from the set of subscribed tickers
     * @param ticker The ticker to unsubscribe from
     */
    unsubscribe(ticker: Ticker) {
        const subscriptions = new Set(this.subscriptionsSubject.getValue())
        subscriptions.delete(ticker)
        this.saveSubscriptions(subscriptions);
    }

    /**
     * Emits newly added tickers by comparing previous and current subscriptions
     * @returns Observable emitting newly subscribed tickers as an array
     */
    subscribed() {
        return this.subscriptionsSubject.pipe(
            startWith(new Set<Ticker>()),
            pairwise(),
            map(([prev, curr]) => difference(curr, prev)),
            map(diffSet => Array.from(diffSet))
        )
    }

    /**
     * Emits removed tickers by comparing previous and current subscriptions
     * @returns Observable emitting unsubscribed tickers as an array
     */
    unsubscribed() {
        return this.subscriptionsSubject.pipe(
            pairwise(),
            map(([prev, curr]) => difference(prev, curr)),
            map(diffSet => Array.from(diffSet))
        )
    }

    /**
     * Checks whether a ticker is currently subscribed
     * @param symbol The ticker to check
     * @returns True if the ticker is subscribed, false otherwise
     */
    isSubscribed(symbol: Ticker) {
        return this.subscriptionsSubject.getValue().has(symbol)
    }
}