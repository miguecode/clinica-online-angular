import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'especialidades',
  standalone: true
})
export class EspecialidadesPipe implements PipeTransform {
  transform(especialidades: string[]): string {
    if (Array.isArray(especialidades)) {
      return especialidades.join(', ');
    } else {
      console.log('El pipe "especialidades" recibió algo distinto a un array');
      return '';
    }
  }
}