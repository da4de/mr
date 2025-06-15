import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { SearchTicker } from './search/components/search-ticker/search-ticker';
import { SearchResult } from './search/components/search-result/search-result';

@Component({
  selector: 'app-root',
  imports: [ChartModule, SearchTicker, SearchResult],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  //constructor(private primeng: PrimeNG) { }

  labels = ['1', '2', '3', '4', '5', '6', '7',];
  data = {
    labels: this.labels,
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 20],
      fill: false,
      borderColor: 'rgb(116, 75, 192)',
      tension: 0.1
    }]
  }
  options = {}
}
