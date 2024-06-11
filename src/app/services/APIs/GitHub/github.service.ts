import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private http = inject(HttpClient);
  
  constructor() {}

  // Voy a devolver un Observable que puede ser de cualquier tipo
  getGithubData(): Observable<any> {
    return this.http.get('https://api.github.com/users/Leumig');
  }
}
