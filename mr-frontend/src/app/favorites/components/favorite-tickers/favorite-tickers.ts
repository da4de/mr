import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { Ticker } from "../../../search/components/search-ticker/search.model";
import { AsyncPipe, NgIf } from "@angular/common";
import { TickerList } from "../../../common/components/tickers-list/tickers-list";
import { FavoriteService } from "../../favorites.service";
import { PrimeIcons } from "primeng/api";

@Component({
    selector: 'favorite-tickers',
    templateUrl: 'favorite-tickers.html',
    imports: [NgIf, AsyncPipe, TickerList],
})
export class FavoriteTickers {
    favorites$!: Observable<Ticker[]>;

    actions = [
        {
            icon: PrimeIcons.CHART_LINE,
            onAction: (item: Ticker) => {
                if (this.favoriteService.isChartTicker(item.symbol)) {
                    this.favoriteService.unsubscribe(item.symbol);
                } else {
                    this.favoriteService.subscribe(item.symbol);
                }
            },
            outlined: (item: Ticker) => 
                !this.favoriteService.isChartTicker(item.symbol)
        },
        {
            icon: PrimeIcons.TRASH,
            onAction: (item: Ticker) => {
                this.favoriteService.delete(item.symbol);
            },
            outlined: true,
        }
    ];

    constructor(private favoriteService: FavoriteService) { }

    ngOnInit() {
        /* TODO simplify*/
        this.favorites$ = this.favoriteService.getFavorities()
    }
}