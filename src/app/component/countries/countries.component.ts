import { Component, OnInit } from '@angular/core';
import { DataWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  public totalConfirmed = 0;
  public totalActive = 0;
  public totalDeaths = 0;
  public totalRecovered = 0;
  data: GlobalDataSummary[];
  public getCountrys: string[] = [];
  public selectedCountryData : DataWiseData[]; 
  public dateWiseData;
  public datatable = [];
  public loading = true;
  chart = {
    LineChart : 'LineChart',
    height: 500, 
    options: {
      animation:{
        duration: 1000,
        easing: 'out',
      },
    }  
  }
  constructor(private dataservice: DataServiceService) {}

  ngOnInit(): void {
    this.dataservice.getDataWiseData().subscribe((result) => {
      this.dateWiseData = result;
      this.updateChart()
      this.loading = false;
    });
    this.dataservice.getGlobalData().subscribe((result) => {
      this.data = result;
      this.data.forEach((result) => {
        this.getCountrys.push(result.country);
      });
      this.loading = false;
      this.getCountrys.unshift('');
    });
  }

  updateChart(){
    this.datatable = [];
    // dataTable.push(["Date" , 'Cases'])
    this.selectedCountryData.forEach(cs=>{
      this.datatable.push([cs.date , cs.case])
    })
  }

  updateValues(country: string) {
    this.data.forEach((GDS) => {
      if (GDS.country == country) {
        this.totalActive = GDS.active;
        this.totalConfirmed = GDS.confirmed;
        this.totalDeaths = GDS.deaths;
        this.totalRecovered = GDS.recovered;
      }
    });
    this.selectedCountryData = this.dateWiseData[country]
    this.updateChart();
  }
}
