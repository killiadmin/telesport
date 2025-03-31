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
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);

  constructor(private http: HttpClient, private router: Router) {}

  loadInitialData(): Observable<OlympicCountry[]>{
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics(): Observable<OlympicCountry[]> {
    return this.olympics$.asObservable();
  }

  /**
   * Recovers a country object by its identifier from the Olympic data.
   *
   * @param {number} countryId
   * @return {Observable<OlympicCountry>}
   */
  getCountryById(countryId: number): Observable<OlympicCountry> {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      map((datas) => {
        const findCountry = datas.find(
          (item: OlympicCountry) => item.id === countryId
        );

        if (!findCountry) {
          this.router.navigate(['/not-found']);
          throw new Error('Country with ID ' + countryId + ' not found!');
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
