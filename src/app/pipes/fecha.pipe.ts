import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha',
  standalone: true
})
export class FechaPipe implements PipeTransform {
  transform(value: { dia: string, hora: string }): string {
    return `${value.dia}, ${value.hora}`;
  }
}