import { Component } from "@angular/core";
import { SearchService } from "../../shared/services/search.service";
import { Stock } from "../stock-search-form/stock-search.model";
import { AsyncPipe, NgIf } from "@angular/common";
import { StocksListComponent } from "../../shared/components/stocks-list/stocks-list.component";
import { FavoriteService } from "../favorites/favorites.service";
import { PrimeIcons } from "primeng/api";
import { Action } from "../../shared/components/actions/actions.model";

/**
 * Component responsible for displaying stock search results
 */
@Component({
    selector: 'search-result',
    templateUrl: 'search-result.component.html',
    imports: [NgIf, AsyncPipe, StocksListComponent],
})
export class SearchResultComponent {
    /** Actions available for the found stocks */
    actions: Action[] = [{
        /** Toggle stock in the favorites list */
        icon: PrimeIcons.STAR,
        onAction: (item: Stock) => {
            if (this.favoriteService.isFavorite(item.symbol)) {
                this.favoriteService.deleteFavorite(item.symbol)
            } else {
                this.favoriteService.addFavorite(item)
            }
            
        },
        outlined: (item: Stock) => 
            !this.favoriteService.isFavorite(item.symbol)
    }]

    constructor(
        private searchService: SearchService,
        private favoriteService: FavoriteService
    ) { }

    /** Returns the current list of searched stocks */
    get searchResults$() {
        return this.searchService.searchResults$;
    }
}