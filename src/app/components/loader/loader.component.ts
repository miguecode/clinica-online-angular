// loader.component.ts
import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="overlay">
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
}
