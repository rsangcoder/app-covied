import { Component, OnInit } from '@angular/core';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public totalConfirmed = 0;
  public totalActive = 0;
  public totalDeaths = 0;
  public totalRecovered = 0;
  public globalData: GlobalDataSummary[];
  public datatable = [];
  public loading = true;
  chart = {
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    GeoChart: 'GeoChart',
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true,
    },
  };
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        this.globalData = result;
        result.forEach((GDS) => {
          if (!Number.isNaN(GDS.confirmed)) {
            this.totalConfirmed += GDS.confirmed;
            this.totalActive += GDS.active;
            this.totalDeaths += GDS.deaths;
            this.totalRecovered += GDS.recovered;
          }
        });
        this.initChart('c');
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  updateChart(input: HTMLInputElement) {
    this.initChart(input.value);
  }

  initChart(caseType: string) {
    this.datatable = [];
    // this.datatable.push(["Country", "Cases"])

    this.globalData.forEach((cs) => {
      let value: number;
      if (caseType == 'c') if (cs.confirmed > 2000) value = cs.confirmed;

      if (caseType == 'a') if (cs.active > 2000) value = cs.active;
      if (caseType == 'd') if (cs.deaths > 1000) value = cs.deaths;

      if (caseType == 'r') if (cs.recovered > 2000) value = cs.recovered;

      this.datatable.push([cs.country, value]);
    });
  }
}
