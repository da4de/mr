import { Component, Input } from "@angular/core";
import { ButtonModule } from 'primeng/button';
import { Stock } from "../../../features/stock-search-form/stock-search.model";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { DataViewModule } from "primeng/dataview";
import { ActionsComponent } from "../actions/actions.component";
import { Action } from "../actions/actions.model";
import { StockPrices } from "../../services/prices.model";

/**
 * Component for displaying a list of stocks with available actions
 */
@Component({
    selector: 'stocks-list',
    templateUrl: 'stocks-list.component.html',
    imports: [NgFor, NgIf, NgClass, DataViewModule, ButtonModule, ActionsComponent]
})
export class StocksListComponent {
    /** List of stocks to display */
    @Input() stocks: Stock[] = [];

    /** Message to display when the stock list is empty */
    @Input() emptyMessage: string = '';

    /** Actions available for each stock item */
    @Input() actions: Action[] = []

    /** Actual stock prices */
    @Input() prices: StockPrices = {}
}
