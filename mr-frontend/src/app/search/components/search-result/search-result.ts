import { Component } from "@angular/core";
import { SearchService } from "../../search.service";
import { Observable } from "rxjs";
import { Ticker } from "../search-ticker/search.model";
import { AsyncPipe, NgIf } from "@angular/common";
import { TickerList } from "../../../common/components/tickers-list/tickers-list";
import { FavoriteService } from "../../../favorites/favorites.service";
import { PrimeIcons } from "primeng/api";
import { Action } from "../../../common/components/actions/actions.model";

@Component({
    selector: 'search-result',
    templateUrl: 'search-result.html',
    imports: [NgIf, AsyncPipe, TickerList],
})
export class SearchResult {
    searchResults$!: Observable<Ticker[]>;

    actions: Action[] = [{
        icon: PrimeIcons.STAR,
        onAction: (item: Ticker) => {
            if (this.favoriteService.isFavorite(item.symbol)) {
                this.favoriteService.delete(item.symbol)
            } else {
                this.favoriteService.add(item)
            }
            
        },
        outlined: (item: Ticker) => 
            !this.favoriteService.isFavorite(item.symbol)
    }]

    constructor(private searchService: SearchService, private favoriteService: FavoriteService) { }

    ngOnInit() {
        /* TODO simplify*/
        this.searchResults$ = this.searchService.getSearchResults();
    }
}