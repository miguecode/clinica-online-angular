import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pais } from '../../classes/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {
  private http = inject(HttpClient);
  private apiUrl = 'https://restcountries.com/v3.1';

  constructor() {}

  getPaises(perPage: number = 250): Observable<Pais[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      map(response => this.filtrarYConvertirPaises(response))
    );
  }

  getPaisPorNombre(nombre: string): Observable<Pais | undefined> {
    return this.http.get<any[]>(`${this.apiUrl}/name/${nombre}`).pipe(
      map(response => {
        if (response && response.length > 0) {
          const paisEncontrado = response[0];
          return new Pais(
            paisEncontrado.name.common,
            paisEncontrado.name.official,
            paisEncontrado.capital ? paisEncontrado.capital[0] : 'N/A',
            paisEncontrado.region,
            paisEncontrado.flags.png
          );
        }
        return undefined;
      })
    );
  }

  private filtrarYConvertirPaises(data: any[]): Pais[] {
    const paisesBuscados = ['Argentina', 'Chile', 'Spain', 'Italy', 'Japan', 'Egypt'];
    return data
      .filter(pais => paisesBuscados.includes(pais.name.common))
      .map(pais => new Pais(
        pais.name.common,
        pais.name.official,
        pais.capital ? pais.capital[0] : 'N/A',
        pais.region,
        pais.flags.png
      ));
  }
}