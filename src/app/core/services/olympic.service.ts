import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OlympicCountry } from "../models/Olympic";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient, private router: Router) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  /**
   * Récupère un objet country par son nom à partir des données olympiques.
   *
   * @param {string} countryName
   * @return {Observable<OlympicCountry>}
   */
  getCountryByName(countryName: string): Observable<OlympicCountry> {
    const formattedName = countryName.replace(/\s+/g, "").toLowerCase();

    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      map((datas) => {
        const findCountry = datas.find(
          (item: OlympicCountry) =>
            item.country.replace(/\s+/g, "").toLowerCase() === formattedName
        );

        if (!findCountry) {
          this.router.navigate(["/not-found"]);
          throw new Error("Country " + countryName + " not found!");
        }

        return findCountry;
      }),
      catchError((error, caught) => {
        console.error(error);
        return caught;
      })
    );
  }
}
