import { Component } from '@angular/core';
import { SearchTicker } from './search/components/search-ticker/search-ticker';
import { SearchResult } from './search/components/search-result/search-result';
import { FavoriteTickers } from "./favorites/components/favorite-tickers/favorite-tickers";
import { MarketStatus } from "./status/status";
import { Charts } from './charts/charts';

@Component({
  selector: 'app-root',
  imports: [SearchTicker, SearchResult, FavoriteTickers, MarketStatus, Charts],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { }
