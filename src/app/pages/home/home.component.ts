import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { OlympicService } from "src/app/core/services/olympic.service";
import { Chart, ChartData, ChartOptions, ChartType } from "chart.js";
import { OlympicCountry } from "src/app/core/models/Olympic";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(ChartDataLabels);

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: false,
})

export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[]> | null = null;
  public totalMedals: number = 0;

  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: true,
        color: "#FFFFFF",
        font: {
          size: 14,
          weight: "bold",
        },
        formatter: (value: number, context: any) => {
          return context.chart.data.labels[context.dataIndex];
        },
      },
    },
  };

  public pieChartType: ChartType = "pie";

  public pieChartData: ChartData<"pie", number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };

  constructor(private olympicService: OlympicService) {}

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

            this.totalMedals = olympics.reduce(
              (total: number, country: OlympicCountry) =>
                total + country.participations.reduce((sum: number, p: any) =>
                  sum + p.medalsCount, 0), 0
            );

            // Background-color
            this.pieChartData.datasets[0].backgroundColor = [
              "#9e5c63",
              "#b3cbea",
              "#82a2e0",
              "#823952",
              "#9b7fa3",
            ];

            // Hover:Background-color
            this.pieChartData.datasets[0].hoverBackgroundColor = [
              "#b97a80",
              "#c6d6ef",
              "#9bb3ea",
              "#9e5e70",
              "#af97b4",
            ];

            // Hover:Border-color
            this.pieChartData.datasets[0].hoverBorderColor = [
              "#b97a80",
              "#c6d6ef",
              "#9bb3ea",
              "#9e5e70",
              "#af97b4",
            ];
          }
        })
      )
      .subscribe();
  }
}
