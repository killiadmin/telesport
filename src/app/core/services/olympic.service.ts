import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OlympicCountry } from "../models/Olympic";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);

  constructor(private http: HttpClient, private router: Router, private snackbar: MatSnackBar) {}

  /**
   * Loads the initial Olympic data from the specified endpoint.
   * The retrieved data is emitted to an internal observable and managed accordingly.
   * In case of an error during the data retrieval process, an error message is logged,
   * displayed to the user via a snackbar, and an empty array is emitted.
   *
   * @return {Observable<OlympicCountry[]>}
   */
  loadInitialData(): Observable<OlympicCountry[]>{
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        console.error("Les données n'ont pu être chargées correctement :", error);
        this.olympics$.next([]);
        this.snackbar.open('Une erreur est survenue, veuillez réessayer ultérieurement.', 'Fermer', {
          duration: 5000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });

        this.router.navigate(['/not-found']);

        return of([]);
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
  getCountryById(countryId: number): Observable<OlympicCountry | null> {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      map((datas) => {
        const findCountry = datas.find((item) => item.id === countryId);

        if (!findCountry) {
          throw new Error("Le pays demandé est introuvable.");
        }

        return findCountry;
      }),
      catchError((error) => {
        console.error("Erreur lors de la récupération du pays :", error);

        this.snackbar.open("La fiche du pays n'est pas disponible, veuillez réessayer ultérieurement.", "Fermer", {
          duration: 5000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });

        this.router.navigate(['/not-found']);

        return of(null);
      })
    );
  }
}
