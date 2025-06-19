import { Component, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FavoriteService } from '../favorites/favorites.service';
import { Observable } from 'rxjs';
import { PricesService } from '../prices/prices.service';
import { Ticker } from '../search/components/search-ticker/search.model';
import { ChartComponent, ChartData, ChartOptions } from 'chart.js';

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

    this.pricesService.getActualPrice().subscribe(prices => {
      for (const ticker in prices) {
        const tickerData = this.data.datasets.find(item => item.label === ticker)
        if (tickerData) {
          tickerData.data.push({ x: prices[ticker].time, y: prices[ticker].price });
        } else {
          this.data.datasets.push({
            label: ticker,
            data: [
              { x: prices[ticker].time, y: prices[ticker].price }
            ],
          })
        }
      }

      (this.chartComponent as any)?.chart?.update()
    })

    this.pricesService.getMinutePrice().subscribe(prices => {
      console.log('minAvgPrice', prices);

      for (const ticker in prices) {
        const tickerData = this.data1min.datasets.find(item => item.label === ticker)
        if (tickerData) {
          tickerData.data.push({ x: Date.now(), y: prices[ticker].price });
        } else {
          this.data1min.datasets.push({
            label: ticker,
            data: [
              { x: Date.now(), y: prices[ticker].price }
            ],
          })
        }
      }

      (this.chartComponent1 as any).chart.update()
    })

    this.pricesService.get15MinutenPrices().subscribe(prices => {
      console.log('get15MinutenPrices', prices);

      for (const ticker in prices) {
        const tickerData = this.data15min.datasets.find(item => item.label === ticker)
        if (tickerData) {
          tickerData.data.push({ x: Date.now(), y: prices[ticker].price });
        } else {
          this.data15min.datasets.push({
            label: ticker,
            data: [
              { x: Date.now(), y: prices[ticker].price }
            ],
          })
        }
      }

      (this.chartComponent15 as any).chart.update()
    })
  }



  data: ChartData<'line'> = {
    labels: getSecLabels(new Date(), 60),
    datasets: []
  }

  data1min: ChartData<'line'> = {
    labels: getMinLabels(new Date(), 15),
    datasets: []
  }

  data15min: ChartData<'line'> = {
    labels: get15MinLabels(new Date(), 3),
    datasets: []
  }

  options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute'
        },
        title: {
          display: true,
          text: 'Time'
        },
        min: Number(Date.now()),
        //max: Number(Date.now() + 60000)
      },
      y: {
        title: {
          display: true,
          text: 'Price'
        },
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };
}
