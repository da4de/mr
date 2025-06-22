import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, map, pairwise } from "rxjs";
import { Ticker } from "../search/components/search-ticker/search.model";
import { LocalStorageService } from "./common/local-storage.service";
import { difference, isNonEmptyString, jsonParseSet } from "../common/utils";
import { LocalStorageKeys } from "../constants/local-storage.keys";

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
    private subscriptionsSubject = new BehaviorSubject<Set<Ticker['symbol']>>(new Set([]));
    readonly subsriptions$ = this.subscriptionsSubject.asObservable();

    constructor(private localStorageService: LocalStorageService) {
        localStorageService.watch(LocalStorageKeys.SubscriptionsTickers).pipe(
            filter(isNonEmptyString),
            map(jsonParseSet<Ticker['symbol']>)
        ).subscribe(value => this.subscriptionsSubject.next(value));
    }

    private saveSubscriptions(subscriptions: Set<Ticker['symbol']>) {
        this.localStorageService.setItem(LocalStorageKeys.SubscriptionsTickers, JSON.stringify([...subscriptions]))
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