import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { OlympicService } from "src/app/core/services/olympic.service";
import { Chart, ChartData, ChartOptions, ChartType } from "chart.js";
import { OlympicCountry } from "src/app/core/models/Olympic";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Router } from "@angular/router";

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
        usePointStyle: true,
        backgroundColor: "#04838f",
        titleColor: "white",
        bodyColor: "white",
        boxPadding: 10,
        callbacks: {
          label: (context) => {
            return [context.label, "🏅" + " " + context.raw];
          },
        },
      },
      datalabels: {
        display: true,
        color: "#FFFFFF",
        font: {
          size: 14,
          weight: "bold",
        },
        formatter: (_value: number, context: any) => {
          return context.chart.data.labels[context.dataIndex];
        },
      },
    },
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const country = (chart.data.labels![elementIndex] as string).replace(/\s+/g, "").toLowerCase();

        this.router.navigate(['/' + country]);
      }
    }
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

  constructor(private olympicService: OlympicService, private router: Router) {}

  /**
   * Initializes the component by retrieving Olympic data and setting up the pie chart configuration.
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

            //Calculation of the total medals
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
