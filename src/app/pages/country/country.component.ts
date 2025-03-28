import { Component, OnInit } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Observable } from 'rxjs';
import { OlympicCountry } from '../../core/models/Olympic';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
  standalone: false,
})

export class CountryComponent implements OnInit {
  public country$: Observable<OlympicCountry | null> | null = null;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute
  ) {};

  ngOnInit(): void {
    const countryId = this.route.snapshot.paramMap.get('id');

    if (countryId) {
      const parseId = parseInt(countryId, 10);
      this.country$ = this.olympicService.getCountryById(parseId);
    }
  }
}
