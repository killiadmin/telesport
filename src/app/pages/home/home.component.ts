import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, filter, shareReplay } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
import { ActiveElement } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})

export class HomeComponent implements OnInit {
  public olympicsData$: Observable<{ olympics: OlympicCountry[], totalMedals: number }> | null = null;
  private readonly image: HTMLImageElement = new Image(20, 20);

  /**
   * Configuration options for a pie chart.
   * This variable defines the settings for rendering a responsive pie chart with various plugins and interactions.
   */
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'center',
      },
      tooltip: {
        enabled: true,
        usePointStyle: true,
        backgroundColor: '#04838f',
        titleColor: 'white',
        bodyColor: 'white',
        boxPadding: 10,
        callbacks: {
          labelPointStyle: () => {
            return {
              pointStyle: this.image.complete ? this.image : 'circle',
              rotation: 0,
            };
          },
          label: (context) => {
            return [`${context.label}`, `${context.raw}`];
          },
        },
      },
      datalabels: {
        display: true,
        color: '#FFFFFF',
        font: {
          size: 14,
          weight: 'bold',
        },
        formatter: (_value: number, context: Context) => {
          return context.chart.data.labels ? context.chart.data.labels[context.dataIndex] : '';
        },
      },
    },
    onClick: (_ChartEvent, activeElements: ActiveElement[]) => {
      this.handleChartClick(activeElements);
    },
  };

  public pieChartType: ChartType = 'pie';

  public pieChartData$: ReplaySubject<ChartData<'pie', number[], string | string[]>> = new ReplaySubject(1);

  constructor(private olympicService: OlympicService, private router: Router) {
    this.image.src = './assets/img/medal.png';
  }

  /**
   * Initializes the component by fetching and processing Olympics data.
   *
   * @return {void}
   */
  ngOnInit(): void {
    this.olympicsData$ = this.olympicService.getOlympics().pipe(
      filter((data) => data.length > 0),
      map((olympics) => {
        const labels = olympics.map((o) => o.country);
        const data = olympics.map((o) =>
          o.participations.reduce((total, p) => total + p.medalsCount, 0)
        );
        const totalMedals = data.reduce((sum, medalCount) => sum + medalCount, 0);

        this.pieChartData$.next({
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: ['#9e5c63', '#b3cbea', '#82a2e0', '#823952', '#9b7fa3'],
              hoverBackgroundColor: ['#b97a80', '#c6d6ef', '#9bb3ea', '#9e5e70', '#af97b4'],
              hoverBorderColor: ['#b97a80', '#c6d6ef', '#9bb3ea', '#9e5e70', '#af97b4'],
            },
          ],
        });

        return {olympics, totalMedals};
      }),
      shareReplay(1),
    );
  }

  /**
   * Click management on a graph section.
   *
   * @param activeElements
   */
  private handleChartClick(activeElements: ActiveElement[]): void {
    if (activeElements.length > 0) {
      const elementIndex = activeElements[0].index; // Index de l'élément cliqué
      if (typeof elementIndex !== 'undefined') {
        this.olympicsData$?.pipe(
          map((data) => {
            const clickedCountry = data.olympics[elementIndex];
            if (clickedCountry) {
              const countryId = clickedCountry.id;
              this.router.navigate(['/details', countryId]);
            }
          })
        ).subscribe();
      }
    }
  }
}
