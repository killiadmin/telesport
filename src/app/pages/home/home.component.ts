import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartOptions, ChartType, ChartData } from 'chart.js';
import { OlympicCountry } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[]> | null = null;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  public pieChartType: ChartType = 'pie';

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };

  constructor(private olympicService: OlympicService) {}


  /**
   * Initializes the component by Olympic data from the service
   *
   * @return {void}
   */
  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.olympics$
      .pipe(
        map((olympics: OlympicCountry[]) => {
          if (olympics?.length > 0) {
            this.pieChartData.labels = olympics.map((o) => o.country);

            this.pieChartData.datasets[0].data = olympics.map((o) =>
              o.participations.reduce(
                (total: number, p: any) => total + p.medalsCount,
                0
              )
            );

            // Background-color
            this.pieChartData.datasets[0].backgroundColor = [
              '#9e5c63',
              '#823952',
              '#82a2e0',
              '#9b7fa3',
              '#b3cbea',
            ];

            // Hover:Background-color
            this.pieChartData.datasets[0].hoverBackgroundColor = [
              '#b97a80',
              '#9e5e70',
              '#9bb3ea',
              '#af97b4',
              '#c6d6ef',
            ];

            // Hover:Border-color
            this.pieChartData.datasets[0].hoverBorderColor = [
              '#b97a80',
              '#9e5e70',
              '#9bb3ea',
              '#af97b4',
              '#c6d6ef',
            ];
          }
        })
      )
      .subscribe();
  }
}
