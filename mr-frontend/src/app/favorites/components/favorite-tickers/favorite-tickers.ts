import { Component } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Ticker } from "../../../search/components/search-ticker/search.model";
import { AsyncPipe, NgIf } from "@angular/common";
import { TickerList } from "../../../common/components/tickers-list/tickers-list";
import { FavoriteService } from "../../favorites.service";

@Component({
    selector: 'favorite-tickers',
    templateUrl: 'favorite-tickers.html',
    imports: [NgIf, AsyncPipe, TickerList],
})
export class FavoriteTickers {
    favorites$!: Observable<Ticker[]>;

    actions = [
        {
            icon: 'pi pi-chart-line',
            action: (item: Ticker) => {
                if (this.favoriteService.isChartTicker(item.symbol)) {
                    this.favoriteService.deleteFromChart(item);
                } else {
                    this.favoriteService.addToChart(item);
                }
            },
            outlined: (item: Ticker) => 
                !this.favoriteService.isChartTicker(item.symbol)
        },
        {
            icon: 'pi pi-trash',
            action: (item: Ticker) => {
                this.favoriteService.delete(item.symbol);
            }
        }];

    constructor(private favoriteService: FavoriteService) { }

    ngOnInit() {
        this.favorites$ = this.favoriteService.favorites$
    }
}