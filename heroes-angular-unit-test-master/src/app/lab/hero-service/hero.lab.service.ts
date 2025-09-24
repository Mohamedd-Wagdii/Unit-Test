import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ihero } from '../../models/ihero';

const options = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroServiceLab {

  private readonly baseUrl = 'http://localhost:3000/heroes'; // API endpoint

  constructor(private httpClient: HttpClient) {}

  /** GET: fetch all heroes */
  fetchHeroes(): Observable<Ihero[]> {
    return this.httpClient.get<Ihero[]>(this.baseUrl);
  }

  /** PUT: update a hero */
  editHero(hero: Ihero): Observable<Ihero> {
    return this.httpClient.put<Ihero>(this.baseUrl, hero, options);
  }
}
