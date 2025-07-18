import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PricesService } from '../../shared/services/prices.service';
import { ChartComponent, ChartData, ChartOptions } from 'chart.js';
import { SubscriptionsService } from '../../shared/services/subscriptions.service';
import { generateColor } from '../../shared/utils/helpers';
import { StockPrices } from '../../shared/services/prices.model';
import { map, OperatorFunction, Subscription } from 'rxjs';

/**
 * Component responsible for displaying price and average charts for subscribed tickers.
 * Displays actual prices and rolling averages over 10 seconds, 1 minute, and 15 minutes.
 */
@Component({
  selector: 'charts',
  imports: [ChartModule],
  templateUrl: 'charts.component.html',
})
export class ChartsComponent implements AfterViewInit, OnDestroy {
  /** Actual price chart component */
  @ViewChild('chart') chartComponent!: ChartComponent;
  /** 10 sec average chart component */
  @ViewChild('chart10sec') chartComponent10sec!: ChartComponent;
  /** 1 min average chart component */
  @ViewChild('chart1min') chartComponent1min!: ChartComponent;
  /** 15 min average chart component */
  @ViewChild('chart15min') chartComponent15min!: ChartComponent;
  /** Data for actual price chart component */
  data: ChartData<'line'> = { datasets: [] }
  /** Data for 10 sec average chart component */
  data10sec: ChartData<'line'> = { datasets: [] }
  /** Data for 1 min average chart component */
  data1min: ChartData<'line'> = { datasets: [] }
  /** Data for 15 min average chart component */
  data15min: ChartData<'line'> = { datasets: [] }
  /** Settings for all chart components */
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
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price, USD'
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
          font: { size: 10 },
          padding: 6
        }
      }
    }
  };

  /** Subscription collector */
  private subscription = new Subscription();

  constructor(private subscriptionsService: SubscriptionsService, private pricesService: PricesService) {
    /* Subscription for new tickers */
    this.subscription.add(
      this.subscriptionsService.subscribed().subscribe(subscribed => {
        subscribed.forEach(ticker => this.pricesService.subscribe(ticker));
      })
    )

    /* Unsubscribe from tickers when the user stops following them or removes them from favorites */
    this.subscription.add(
      this.subscriptionsService.unsubscribed().subscribe(unsubscribed => {
        unsubscribed.forEach(ticker => this.pricesService.unsubscribe(ticker));
        /* Remove data from charts */
        this.removeTickersFromChart(this.chartComponent, unsubscribed);
        this.removeTickersFromChart(this.chartComponent10sec, unsubscribed);
        this.removeTickersFromChart(this.chartComponent1min, unsubscribed);
        this.removeTickersFromChart(this.chartComponent15min, unsubscribed);
      })
    )
  }

  /**
   * Removes datasets with the given tickers from the provided chart
   * @param chartComponent The chart component from which to remove datasets
   * @param tickers An array of ticker symbols identifying which datasets to remove
   */
  private removeTickersFromChart(chartComponent: ChartComponent, tickers: string[]) {
    const chartData = (chartComponent as any)?.chart?.data as ChartData<'line', { x: number, y: number }[]>;

    for (const ticker of tickers) {
      const dataIndex = chartData.datasets.findIndex(item => item.label === ticker)
      if (dataIndex >= 0) {
        chartData.datasets.splice(dataIndex, 1);

      }
    }

    (chartComponent as any)?.chart?.update()
  }

  /**
   * Returns a handler function that updates the given chart with new ticker prices
   * @param chartComponent The chart component to update
   * @returns A function that handles price updates for the specified chart
   */
  onPriceChanged = (chartComponent: ChartComponent) => {
    let lastTime = Date.now();
    return function (prices: StockPrices) {
      const chartData = (chartComponent as any)?.chart?.data as ChartData<'line', { x: number, y: number }[]>;
      
      for (const ticker in prices) {
        const tickerData = chartData.datasets.find(item => item.label === ticker)
        if (tickerData) {
          tickerData.data.push({ x: prices[ticker].time, y: prices[ticker].price });
          /* Stock prices sometimes arrive unsorted, so we explicitly sort them */
          if (lastTime > prices[ticker].time) {
            tickerData.data.sort((a, b) => a.x - b.x)
          }
        } else {
          chartData.datasets.push({
            label: ticker,
            data: [{ x: prices[ticker].time, y: prices[ticker].price }],
            borderColor: generateColor(chartData.datasets.length)
          })
        }
        lastTime = prices[ticker].time;
      }

      (chartComponent as any)?.chart?.update()
    }
  }

  /* Keeps only subscribed tickers in the price data */
  private onlySubscribedPrices(): OperatorFunction<StockPrices, StockPrices> {
    return map(prices => {
      const result: StockPrices = {}
      for (const ticker in prices) {
        if (this.subscriptionsService.isSubscribed(ticker)) {
          result[ticker] = prices[ticker]
        }
      }
      return result
    })
  }

  /**
   * Subscribes to price streams and updates corresponding chart components with live data
   */
  ngAfterViewInit() {
    this.subscription.add(
      this.pricesService.getActualPrice()
        .pipe(this.onlySubscribedPrices())
        .subscribe(this.onPriceChanged(this.chartComponent))
    )
    this.subscription.add(
      this.pricesService.getAveragePrice(10000)
        .pipe(this.onlySubscribedPrices())
        .subscribe(this.onPriceChanged(this.chartComponent10sec))
    )
    this.subscription.add(
      this.pricesService.getAveragePrice(60000)
        .pipe(this.onlySubscribedPrices())
        .subscribe(this.onPriceChanged(this.chartComponent1min))
    )
    this.subscription.add(
      this.pricesService.getAveragePrice(15 * 60000)
        .pipe(this.onlySubscribedPrices())
        .subscribe(this.onPriceChanged(this.chartComponent15min))
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
