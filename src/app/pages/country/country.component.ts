import { Component, OnInit } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Observable } from 'rxjs';
import { OlympicCountry } from '../../core/models/Olympic';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  standalone: false,
})

export class CountryComponent implements OnInit {
  public country$: Observable<OlympicCountry | null> | null = null;

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

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const countryId = this.route.snapshot.paramMap.get('id');

    if (countryId) {
      const parsedId = parseInt(countryId, 10);
      this.country$ = this.olympicService.getCountryById(parsedId);

      this.country$.subscribe((country) => {
        if (country) {
          const years = country.participations.map((p) => p.year);
          const medals = country.participations.map((p) => p.medalsCount);

          this.lineChartData.labels = years;
          this.lineChartData.datasets[0].data = medals;
        }
      });
    }
  }
}
