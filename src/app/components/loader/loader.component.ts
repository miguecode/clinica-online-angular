// loader.component.ts
import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

const mostrarOcultar = trigger('mostrarOcultarTrigger', [
  transition (':enter', [
    style({ opacity: 0 }),
    animate('0.35s', style({ opacity: 1 }))
  ]),
  transition (':leave', [
    style({ opacity: 1 }),
    animate('0.35s', style({ opacity: 0 }))
  ]),
]);

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  animations: [mostrarOcultar],
  template: `
    <div *ngIf="isLoading" class="overlay" @mostrarOcultarTrigger>
      <div class="spinner"></div>
    </div>
  `,
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  isLoading = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.loaderState.subscribe(state => {
      this.isLoading = state;
    });
  }

  mostrarOcultar() {
    this.isLoading = !this.isLoading;
  }
}
