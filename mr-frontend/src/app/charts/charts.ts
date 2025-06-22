import { Component, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ITickerPrices, PricesService } from '../services/prices.service';
import { ChartComponent, ChartData, ChartOptions } from 'chart.js';
import { SubscriptionsService } from '../services/subscriptions.service';
import { generateColor } from '../common/utils';

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
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'line',
          font: {
            size: 10
          },
          padding: 6
        }
      }
    }
  };

  constructor(private subscriptionsService: SubscriptionsService, private pricesService: PricesService) {
    this.subscriptionsService.subsriptions$.subscribe(subscribed => {
      subscribed.forEach(symbol => this.pricesService.subscribe(symbol));
    })

    this.subscriptionsService.subscribed().subscribe(subscribed => {
      subscribed.forEach(symbol => this.pricesService.subscribe(symbol));
    })

    this.subscriptionsService.unsubscribed().subscribe(unsubscribed => {
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
