import { Component, OnInit, OnDestroy } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicCountry } from '../../core/models/Olympic';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  standalone: false,
})

export class CountryComponent implements OnInit, OnDestroy {
  public country$: Observable<OlympicCountry | null> | null = null;

  public totalMedals: number = 0;
  public totalAthletes: number = 0;
  public totalEntries: number = 0;

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Medals',
        borderColor: '#04838f',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'center',
      },
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Years',
        },
        ticks: {
          stepSize: 1,
          callback: (value) => value,
        },
        min: 2012,
        max: 2020,
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of medals',
        },
        ticks: {
          stepSize: 5,
        },
        min: 0,
        max: 130,
      },
    },
  };

  public lineChartType: ChartType = 'line';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const countryId = this.route.snapshot.paramMap.get('id');

    if (countryId) {
      const parsedId = parseInt(countryId, 10);
      this.country$ = this.olympicService.getCountryById(parsedId);

      this.country$
        .pipe(takeUntil(this.destroy$))
        .subscribe((country) => {
          if (country) {
            const years = country.participations.map((p) => p.year);
            const medals = country.participations.map((p) => p.medalsCount);

            this.lineChartData.labels = years;
            this.lineChartData.datasets[0].data = medals;

            this.totalMedals = country.participations.reduce(
              (total, p) => total + p.medalsCount, 0
            );

            this.totalAthletes = country.participations.reduce(
              (total, p) => total + p.athleteCount, 0
            );

            this.totalEntries = country.participations.length;
          }
        });
    }
  }

  /**
   * Navigates the application to the home page.
   *
   * @return {void}
   */
  goToHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Method that is called when the component or directive is destroyed.
   *
   * @return {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
