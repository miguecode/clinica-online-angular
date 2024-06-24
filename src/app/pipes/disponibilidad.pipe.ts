import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'disponibilidad',
  standalone: true
})
export class DisponibilidadPipe implements PipeTransform {

  transform(disponibilidad: { [key: string]: string[] }): string {
    if (!disponibilidad || typeof disponibilidad !== 'object') {
      console.log('El pipe "dipsonibilidad" no recibió lo que debería');
      return '';
    }

    const diasDisponibles = Object.keys(disponibilidad);
    return diasDisponibles.map(dia => {
      const horarios = disponibilidad[dia].join(', ');
      return `${dia}: ${horarios}`;
    }).join(' | ');
  }
}