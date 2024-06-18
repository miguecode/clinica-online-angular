import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mostrar-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mostrar-horarios.component.html',
  styleUrls: ['./mostrar-horarios.component.css']
})
export class MostrarHorariosComponent {
  @Input() horarios: { [key: string]: string[] } = {};
  @Output() horariosSeleccionados = new EventEmitter<{ [key: string]: string[] }>();
  @Output() cerrarMostrarHorarios = new EventEmitter<void>(); // Define el evento de salida para cerrar

  diaSeleccionado: string | null = null;
  horasSeleccionadas: { [key: string]: string[] } = {};

  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  horariosDiaDeSemana: string[] = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
  ];
  horasPorDia: { [key: string]: string[] } = {
    'Lunes': this.horariosDiaDeSemana,
    'Martes': this.horariosDiaDeSemana,
    'Miércoles': this.horariosDiaDeSemana,
    'Jueves': this.horariosDiaDeSemana,
    'Viernes': this.horariosDiaDeSemana,
    'Sábado': ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00',
               '11:30', '12:00', '12:30', '13:00', '13:30', '14:00']
  };

  seleccionarDia(dia: string) {
    this.diaSeleccionado = dia;
    if (!this.horasSeleccionadas[dia]) {
      this.horasSeleccionadas[dia] = [];
    }
  }

  toggleHorarioSeleccionado(horario: string) {
    if (this.diaSeleccionado) {
      const index = this.horasSeleccionadas[this.diaSeleccionado].indexOf(horario);
      if (index === -1) {
        this.horasSeleccionadas[this.diaSeleccionado].push(horario);
      } else {
        this.horasSeleccionadas[this.diaSeleccionado].splice(index, 1);
      }
    }
  }

  isHorarioSeleccionado(horario: string): boolean {
    return this.diaSeleccionado ? this.horasSeleccionadas[this.diaSeleccionado].includes(horario) : false;
  }

  obtenerHorariosDisponibles(dia: string): string[] {
    return this.horasPorDia[dia];
  }

  agregarHorarios() {
    if (this.diaSeleccionado && this.horasSeleccionadas[this.diaSeleccionado].length > 0) {
      this.horarios[this.diaSeleccionado] = this.horasSeleccionadas[this.diaSeleccionado];
    }
    this.cancelarHorarios();
  }

  cancelarHorarios() {
    this.diaSeleccionado = null;
    this.horasSeleccionadas = {};
  }

  getHorariosKeys(): string[] {
    return Object.keys(this.horarios);
  }

  cerrar() {
    this.cerrarMostrarHorarios.emit();
  }

  guardarCambios() {
    this.horariosSeleccionados.emit(this.horarios);
    this.cerrarMostrarHorarios.emit();
  }
}
