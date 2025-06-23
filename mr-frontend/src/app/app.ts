import { Component } from '@angular/core';
import { StockSearchFormComponent } from './features/stock-search-form/stock-search-form.component';
import { SearchResultComponent } from './features/search-result/search-result.component';
import { MarketStatusComponent } from './features/market-status/market-status.component';
import { FavoriteStocksComponent } from './features/favorites/favorite-stocks.component';
import { ChartsComponent } from './features/charts/charts.component';

@Component({
  selector: 'app-root',
  imports: [
    StockSearchFormComponent,
    SearchResultComponent,
    MarketStatusComponent,
    FavoriteStocksComponent,
    ChartsComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }
