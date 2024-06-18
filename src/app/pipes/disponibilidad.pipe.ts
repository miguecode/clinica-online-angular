import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'disponibilidad',
  standalone: true
})
export class DisponibilidadPipe implements PipeTransform {

  transform(disponibilidad: { [key: string]: string[] }): string {
    if (!disponibilidad) {
      return '';
    }

    const diasDisponibles = Object.keys(disponibilidad);
    return diasDisponibles.map(dia => {
      const horarios = disponibilidad[dia].join(', ');
      return `${dia}: ${horarios}`;
    }).join(' | ');
  }

}
