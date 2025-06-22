import { Component } from "@angular/core";
import { AsyncPipe, NgIf } from "@angular/common";
import { StocksListComponent } from "../../shared/components/stocks-list/stocks-list.component";
import { PrimeIcons } from "primeng/api";
import { Stock } from "../stock-search-form/stock-search.model";
import { FavoriteService } from "./favorites.service";
import { SubscriptionsService } from "../../shared/services/subscriptions.service";

/**
 * Component responsible for displaying the user's favorite stocks
 */
@Component({
    selector: 'favorite-stocks',
    templateUrl: 'favorite-stocks.component.html',
    imports: [NgIf, AsyncPipe, StocksListComponent],
})
export class FavoriteStocksComponent {
    /** Actions available for each favorite stock */
    actions = [
        {
            /** Toggles price subscription for the stock and updates related charts */
            icon: PrimeIcons.CHART_LINE,
            onAction: (item: Stock) => {
                if (this.subscriptionsService.isSubscribed(item.symbol)) {
                    this.subscriptionsService.unsubscribe(item.symbol);
                } else {
                    this.subscriptionsService.subscribe(item.symbol);
                }
            },
            outlined: (item: Stock) =>
                !this.subscriptionsService.isSubscribed(item.symbol)
        },
        {
            /* Removes the stock from the favorites list  */
            icon: PrimeIcons.TRASH,
            onAction: (item: Stock) => {
                this.favoriteService.deleteFavorite(item.symbol);
            },
            outlined: true,
        }
    ];

    constructor(
        private favoriteService: FavoriteService,
        private subscriptionsService: SubscriptionsService
    ) { }

    /**
     * Returns the current list of favorite stocks
     */
    get favorites$() {
        return this.favoriteService.favorites$
    }
}