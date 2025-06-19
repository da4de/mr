import { Component, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FavoriteService } from '../favorites/favorites.service';
import { Observable } from 'rxjs';
import { PricesService } from '../prices/prices.service';
import { Ticker } from '../search/components/search-ticker/search.model';
import { ChartComponent, ChartData } from 'chart.js';

function getHHMMSS(date: Date) {
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

function getHHMM(date: Date) {
  return `${date.getHours()}:${date.getMinutes()}`
}

function getSecLabels(startTime: Date, count: number) {
  const result = [getHHMMSS(startTime)]
  for (let i = 1; i <= count; i++) {
    result.push(getHHMMSS(new Date(Number(startTime) + i * 1000)))
  }
  return result
}

function getMinLabels(startTime: Date, count: number) {
  const result = [getHHMM(startTime)]
  for (let i = 1; i <= count; i++) {
    result.push(getHHMM(new Date(Number(startTime) + i * 60000)))
  }
  return result
}

function get15MinLabels(startTime: Date, count: number) {
  const result = [getHHMM(startTime)]
  for (let i = 1; i <= count; i++) {

    result.push(getHHMM(new Date(Number(startTime) + 15 * i * 60000)))
  }
  return result
}


@Component({
  selector: 'charts',
  imports: [ChartModule],
  templateUrl: 'charts.html',
})
export class Charts {
  @ViewChild('chart') chartComponent!: ChartComponent;
  @ViewChild('chart1') chartComponent1!: ChartComponent;
  @ViewChild('chart15') chartComponent15!: ChartComponent;
  private chartTickers$: Observable<Ticker[]>

  constructor(private favoriteService: FavoriteService, private pricesService: PricesService) {
    this.chartTickers$ = this.favoriteService.getChartTickers();
  }

  /* todo */
  actualCount = 0;

  ngOnInit() {
    this.chartTickers$.subscribe(chartTickers => {
      const chartTickersSymbols = chartTickers.map(ticker => ticker.symbol);
      /* subscribe */
      chartTickersSymbols.forEach(symbol => {
        this.pricesService.subscribe(symbol);
      })
      /* unsubsribe */
      this.pricesService.getSubscriptions().filter(symbol => !chartTickersSymbols.includes(symbol)).forEach(symbol => {
        this.pricesService.unsubscribe(symbol);
      })
    })

    this.pricesService.getActualPrice().subscribe(actualPrices => {
      this.actualCount++
      //console.log('actualPrices', actualPrices);

      for (const ticker in actualPrices) {
        const tickerData = this.data.datasets.find(item => item.label === ticker)
        if (tickerData) {
          tickerData.data.push(actualPrices[ticker].price)
        } else {
          const tickerData = new Array(this.actualCount).fill(null)
          tickerData.push(actualPrices[ticker].price)
          this.data.datasets.push({
            label: ticker,
            data: tickerData,
            fill: false,
            tension: 0.2
          })
        }
      }

      (this.chartComponent as any).chart.update()
    })

    this.pricesService.getMinutePrice().subscribe(avgPrice => {
      console.log('minAvgPrice', avgPrice);
      for (const ticker in avgPrice) {
        const tickerData = this.data1min.datasets.find(item => item.label === ticker)
        if (tickerData) {
          tickerData.data.push(avgPrice[ticker].price)
        } else {
          const tickerData = new Array(this.actualCount).fill(null)
          tickerData.push(avgPrice[ticker].price)
          this.data1min.datasets.push({
            label: ticker,
            data: tickerData,
            fill: false,
            tension: 0.2
          })
        }
      }

      (this.chartComponent1 as any).chart.update()

    })

    this.pricesService.get15MinutenPrices().subscribe(avgPrice => {
      console.log('get15MinutenPrices', avgPrice);
    })
  }



  data: ChartData = {
    labels: getSecLabels(new Date(), 60),
    datasets: []
  }

  data1min: ChartData = {
    labels: getMinLabels(new Date(), 15),
    datasets: []
  }

  data15min: ChartData = {
    labels: get15MinLabels(new Date(), 3),
    datasets: []
  }

  options = {}
}
