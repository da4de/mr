import { Component } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SearchService } from "../../search.service";
import { FormsModule } from "@angular/forms";
import { SearchTickerParams } from "./search.model";

@Component({
    selector: 'search-ticker',
    templateUrl: 'search-ticker.html',
    imports: [ButtonModule, InputTextModule, FormsModule]
})
export class SearchTicker {
    searchParams = new SearchTickerParams('MSFT')

    constructor(private searchService: SearchService) { }

    onSubmit = async () => {
        this.searchService.updateSearchParams(this.searchParams)
    }
}