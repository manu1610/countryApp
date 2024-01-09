import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'countries-by-capital-page',
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent implements OnInit {

  public countries: Country[] = [];
  public initialValue: string = '';
  public isLoading: boolean = false;

  constructor(private countriesService: CountriesService){}

  ngOnInit(): void {
    this.initialValue = this.countriesService.cacheStore.byCapital.term;
    this.countries = this.countriesService.cacheStore.byCapital.countries;
  }

  searchByCapital(term: string){
    this.isLoading = true;
    this.countriesService.searchCapital(term)
      .subscribe( countries => { this.countries = countries; this.isLoading = false;});
  }

}
