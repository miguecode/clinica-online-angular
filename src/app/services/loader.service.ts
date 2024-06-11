import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderSubject = new BehaviorSubject<boolean>(false);
  loaderState = this.loaderSubject.asObservable();

  show(): void {
    this.loaderSubject.next(true);
  }

  hide(): void {
    this.loaderSubject.next(false);
  }
}