import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EspecialidadesService } from '../../services/especialidades.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent {
  especialidadesForm: FormGroup;
  especialidades: string[] = [];
  nuevaEspecialidad: string = '';
  @Output() especialidadesSeleccionadas = new EventEmitter<string[]>();
  @Output() cerrarEspecialidades = new EventEmitter<void>(); // Define el evento de salida para cerrar

  constructor(
    private fb: FormBuilder,
    private especialidadesService: EspecialidadesService
  ) {
    this.especialidadesForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  async cargarEspecialidades() {
    this.especialidades = await this.especialidadesService.getEspecialidades();
    this.especialidades.forEach(especialidad => {
      this.especialidadesForm.addControl('especialidad_' + especialidad, new FormControl(false));
    });
  }

  agregarNuevaEspecialidad() {
    if (this.nuevaEspecialidad.trim() !== '') {
      this.especialidadesService.agregarEspecialidad(this.nuevaEspecialidad).then(() => {
        this.especialidades.push(this.nuevaEspecialidad);
        this.especialidadesForm.addControl('especialidad_' + this.nuevaEspecialidad, new FormControl(true));
        this.nuevaEspecialidad = '';
      });
    }
  }

  enviarEspecialidadesSeleccionadas() {
    const seleccionadas = this.especialidades.filter(especialidad => this.especialidadesForm.get('especialidad_' + especialidad)?.value);
    this.especialidadesSeleccionadas.emit(seleccionadas);
    this.cerrar();
  }


  cerrar() {
    this.cerrarEspecialidades.emit(); // Emitir el evento para cerrar
  }
}
