import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DataWiseData } from '../models/date-wise-data';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  private getGlobalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-20-2021.csv`;
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  constructor(private http: HttpClient) {}

  getDataWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        let rows = result.split('\n');
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach((row) => {
          let cols = row.split(/,(?=\S)/);
          let con = cols[1];
          cols.splice(0, 4);
          mainData[con] = [];
          cols.forEach((val, i) => {
            let dw: DataWiseData = {
              case: +val,
              country: con,
              date: new Date(Date.parse(dates[i])),
            };
            mainData[con].push(dw);
          });
        });
        // console.log(mainData);

        return mainData;
      })
    );
  }
  getGlobalData() {
    return this.http.get(this.getGlobalDataUrl, { responseType: 'text' }).pipe(
      map((result) => {
        let data: GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0, 1);
        rows.forEach((row) => {
          let cols = row.split(/,(?=\S)/);

          let GDS = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          };
          // console.log(GDS);
          let temp: GlobalDataSummary = raw[GDS.country];
          if (temp) {
            temp.active = GDS.active + temp.active;
            temp.confirmed = GDS.confirmed + temp.confirmed;
            temp.deaths = GDS.deaths + temp.deaths;
            temp.recovered = GDS.recovered + temp.recovered;
            raw[GDS.country] = temp;
          } else {
            raw[GDS.country] = GDS;
          }
        });
        return <GlobalDataSummary[]>Object.values(raw);
      })
    );
  }
}
