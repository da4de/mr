import { Component } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SearchService } from "../../shared/services/search.service";
import { FormsModule } from "@angular/forms";
import { StocksSearchParams } from "./stock-search.model";

/**
 * Component responsible for displaying the stock search form
 */
@Component({
    selector: 'stock-search-form',
    templateUrl: 'stock-search-form.component.html',
    imports: [ButtonModule, InputTextModule, FormsModule]
})
export class StockSearchFormComponent {
    /** Current search parameters entered by the user */
    searchParams: StocksSearchParams = {search: ''}

    constructor(private searchService: SearchService) { }

    /**
     * Handles form submission, updates the search service with new parameters
     */
    onSubmit = () => {
        this.searchService.updateSearchParams(this.searchParams)
    }
}