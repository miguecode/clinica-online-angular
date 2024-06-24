import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha',
  standalone: true
})
export class FechaPipe implements PipeTransform {
  transform(fecha: { dia: string, hora: string }): string {
    if (!fecha || typeof fecha !== 'object') {
      console.log('La fecha no recibió lo que debería');
      return '';
    }

    return `${fecha.dia}, ${fecha.hora}`;
  }
}