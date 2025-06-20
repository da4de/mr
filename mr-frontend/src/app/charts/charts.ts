import { Component, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { FavoriteService } from '../favorites/favorites.service';
import { ITickerPrices, PricesService } from '../prices/prices.service';
import { ChartComponent, ChartData, ChartOptions } from 'chart.js';

function generateColor(index: number): string {
  const colors = [
    '#3366CC', '#DC3912', '#FF9900', '#109618',
    '#990099', '#3B3EAC', '#0099C6', '#DD4477',
    '#66AA00', '#B82E2E', '#316395', '#994499'
  ];
  return colors[index % colors.length];
}

@Component({
  selector: 'charts',
  imports: [ChartModule],
  templateUrl: 'charts.html',
})
export class Charts {
  @ViewChild('chart') chartComponent!: ChartComponent;
  @ViewChild('chart10sec') chartComponent10sec!: ChartComponent;
  @ViewChild('chart1min') chartComponent1min!: ChartComponent;
  @ViewChild('chart15min') chartComponent15min!: ChartComponent;

  data: ChartData<'line'> = {
    datasets: []
  }

  data10sec: ChartData<'line'> = {
    datasets: []
  }

  data1min: ChartData<'line'> = {
    datasets: []
  }

  data15min: ChartData<'line'> = {
    datasets: []
  }

  options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm'
          }
        },
        title: {
          display: true,
          text: 'Time'
        },
        min: Number(Date.now()),
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

  constructor(private favoriteService: FavoriteService, private pricesService: PricesService) {
    this.favoriteService.subscriptions().subscribe(subscribed => {
      subscribed.forEach(symbol => this.pricesService.subscribe(symbol));
    })

    this.favoriteService.subscribed().subscribe(subscribed => {
      subscribed.forEach(symbol => this.pricesService.subscribe(symbol));
    })

    this.favoriteService.unsubscribed().subscribe(unsubscribed => {
      unsubscribed.forEach(symbol => this.pricesService.unsubscribe(symbol));
    })
    
  }

  onPriceChanged = (chartComponent: ChartComponent) => (prices: ITickerPrices) => {
    const chartData: ChartData = (chartComponent as any)?.chart?.data

    for (const ticker in prices) {
      const tickerData = chartData.datasets.find(item => item.label === ticker)
      if (tickerData) {
        tickerData.data.push({ x: prices[ticker].time, y: prices[ticker].price });
      } else {
        chartData.datasets.push({
          label: ticker,
          data: [
            { x: prices[ticker].time, y: prices[ticker].price }
          ],
          borderColor: generateColor(chartData.datasets.length)
        })
      }
    }

    (chartComponent as any)?.chart?.update()
  }

  ngAfterViewInit() {
    this.pricesService.getActualPrice().subscribe(this.onPriceChanged(this.chartComponent))
    this.pricesService.getAveragePrice(10000).subscribe(this.onPriceChanged(this.chartComponent10sec))
    this.pricesService.getAveragePrice(60000).subscribe(this.onPriceChanged(this.chartComponent1min))
    this.pricesService.getAveragePrice(15 * 60000).subscribe(this.onPriceChanged(this.chartComponent15min))
  }
}
