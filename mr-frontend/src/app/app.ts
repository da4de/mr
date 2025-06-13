import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, ChartModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private http = inject(HttpClient)
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
  onclick = async () => {
    /* just for test */
    this.http.get('/stocks/list').subscribe(test => {
      console.log('test', test)
    })
  }
}
