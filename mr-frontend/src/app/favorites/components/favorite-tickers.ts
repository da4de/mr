import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Ticker } from "../../search/components/search-ticker/search.model";
import { AsyncPipe, NgIf } from "@angular/common";
import { TickerList } from "../../common/components/tickers-list/tickers-list";
import { FavoriteService } from "../../services/favorites.service";
import { PrimeIcons } from "primeng/api";
import { SubscriptionsService } from "../../services/subscriptions.service";

@Component({
    selector: 'favorite-tickers',
    templateUrl: 'favorite-tickers.html',
    imports: [NgIf, AsyncPipe, TickerList],
})
export class FavoriteTickers {
    actions = [
        {
            icon: PrimeIcons.CHART_LINE,
            onAction: (item: Ticker) => {
                if (this.subscriptionsService.isChartTicker(item.symbol)) {
                    this.subscriptionsService.unsubscribe(item.symbol);
                } else {
                    this.subscriptionsService.subscribe(item.symbol);
                }
            },
            outlined: (item: Ticker) => 
                !this.subscriptionsService.isChartTicker(item.symbol)
        },
        {
            icon: PrimeIcons.TRASH,
            onAction: (item: Ticker) => {
                this.favoriteService.deleteFavorite(item.symbol);
            },
            outlined: true,
        }
    ];

    constructor(private favoriteService: FavoriteService, private subscriptionsService: SubscriptionsService) { }

    get favorites$() {
        return this.favoriteService.favorites$
    }
}