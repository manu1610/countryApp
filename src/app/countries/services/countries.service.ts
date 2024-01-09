import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';
import { isPlatformBrowser } from '@angular/common';

@Injectable({providedIn: 'root'})
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';

   public cacheStore: CacheStore = {
    byCapital: { term: '', countries: []},
    byCountries: { term: '', countries: []},
    byRegion: { region: '', countries: []}
   }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    if(isPlatformBrowser(this.platformId)) {
      this.loadFromLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(): void {
    if(!localStorage.getItem('cacheStore')) return;
    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]> (url)
    .pipe(
      catchError( () => of([]))
    );
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`;
    return this.http.get<Country[]>(url)
      .pipe(
        map( countries => countries.length > 0 ? countries[0] : null),
        catchError( () => of(null))
      );
  }

  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;
    return this.getCountriesRequest(url)
        .pipe(
          tap(countries => this.cacheStore.byCapital = {term: term, countries}),
          tap( () => this.saveToLocalStorage())
        );
  }

  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap(countries => this.cacheStore.byCountries = {term: term, countries}),
      tap( () => this.saveToLocalStorage())
    );
  }

  searchRegion(term: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${term}`;
    return this.getCountriesRequest(url)
    .pipe(
      tap(countries => this.cacheStore.byRegion = {region: term, countries}),
      tap( () => this.saveToLocalStorage())
    );
  }


}
