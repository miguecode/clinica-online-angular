import { Component, Input, OnInit } from '@angular/core';
import { Usuario } from '../../../classes/usuario';
import { FirestoreUsuariosService } from '../../../services/firestore-usuarios.service';
import { LoaderService } from '../../../services/loader.service';
import { TurnosService } from '../../../services/turnos.service';
import { EspecialidadesService } from '../../../services/especialidades.service';  // Importa el servicio
import { Turno } from '../../../classes/turno';
import { Especialista } from '../../../classes/especialista';
import { Paciente } from '../../../classes/paciente';

@Component({
  selector: 'app-tabla-turnos',
  standalone: true,
  imports: [],
  templateUrl: './tabla-turnos.component.html',
  styleUrls: ['./tabla-turnos.component.css']
})
export class TablaTurnosComponent implements OnInit {
  @Input() usuarioActual: Usuario | undefined = undefined;
  turnos: Turno[] = []; // Lista de todos los turnos
  especialistas: Especialista[] = []; // Lista de todos los especialistas
  pacientes: Paciente[] = []; // Lista de todos los pacientes
  especialidades: string[] = []; // Lista de todas las especialidades
  especialidadSeleccionada: string[] = []; // Lista de las especialidades seleccionadas
  especialistaSeleccionado: string[] = []; // Lista de los especialistas seleccionados
  pacienteSeleccionado: string[] = []; // Lista de los pacientes seleccionados

  constructor(
    private usuarioService: FirestoreUsuariosService,
    private loader: LoaderService,
    private turnosService: TurnosService,
    private especialidadesService: EspecialidadesService
  ) {}

  ngOnInit(): void {
    this.cargarTurnos(); // Al iniciar cargo todos los turnos
    
    if (this.usuarioActual?.perfil === 'Paciente') {
      this.cargarEspecialidades();
      this.cargarEspecialistas();
      // Si el usuario es un paciente, cargo todas las especialidades y todos los especialistas
    } else if (this.usuarioActual instanceof Especialista) {
      this.cargarPacientes();
      this.especialidades = this.usuarioActual.especialidad;
      // Si el usuario es un especialista, cargo sólo sus especialidades y todos los pacientes
    }
  }

  async cargarTurnos() {
    this.loader.show();
    try {
      this.turnos = await this.turnosService.getTurnos();

      // Me aseguro de que los turnos mostrados son propios del usuario
      this.turnos = this.turnos.filter(turno =>
        turno.apellidoPaciente === this.usuarioActual?.apellido ||
        turno.apellidoEspecialista === this.usuarioActual?.apellido
      );

    } catch (error) {
      console.error('Error obteniendo turnos:', error);
    } finally {
      this.loader.hide();
      console.log(this.turnos);
    }
  }

  async cargarEspecialistas() {
    this.loader.show();
    try {
      const usuarios = await this.usuarioService.obtenerUsuariosPorPerfil('Especialista', 99);
      this.especialistas = usuarios.filter(user => user instanceof Especialista) as Especialista[];
    } catch (error) {
      console.error('Error obteniendo especialistas:', error);
    } finally {
      this.loader.hide();
      console.log(this.especialistas);
    }
  }
  async cargarPacientes() {
    this.loader.show();
    try {
      const usuarios = await this.usuarioService.obtenerUsuariosPorPerfil('Paciente', 99);
      this.pacientes = usuarios.filter(user => user instanceof Paciente) as Paciente[];
    } catch (error) {
      console.error('Error obteniendo pacientes:', error);
    } finally {
      this.loader.hide();
      console.log(this.pacientes);
    }
  }
  async cargarEspecialidades() {
    this.loader.show();
    try {
      this.especialidades = await this.especialidadesService.getEspecialidades();
    } catch (error) {
      console.error('Error obteniendo especialidades:', error);
    } finally {
      this.loader.hide();
      console.log(this.especialidades);
    }
  }


  // Devuelve un array con los turnos que pasen el filtro de los Checkbox
  get turnosFiltrados() {
    if (this.usuarioActual?.perfil === 'Paciente') {
      return this.turnos.filter(turno =>
        (this.especialidadSeleccionada.length === 0 || this.especialidadSeleccionada.includes(turno.especialidad)) &&
        (this.especialistaSeleccionado.length === 0 || this.especialistaSeleccionado.includes(turno.apellidoEspecialista))
      );
    } else {
      return this.turnos.filter(turno =>
        (this.especialidadSeleccionada.length === 0 || this.especialidadSeleccionada.includes(turno.especialidad)) &&
        (this.pacienteSeleccionado.length === 0 || this.pacienteSeleccionado.includes(turno.apellidoPaciente))
      );
    }
  }

  // Quita o agrega elementos a las listas afectadas por los Checkbox
  actualizarFiltro(tipo: string, valor: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (tipo === 'especialidad') {
      if (isChecked) {
        this.especialidadSeleccionada.push(valor);
      } else {
        this.especialidadSeleccionada = this.especialidadSeleccionada.filter(especialidad => especialidad !== valor);
      }
    } else if (tipo === 'especialista') {
      if (isChecked) {
        this.especialistaSeleccionado.push(valor);
      } else {
        this.especialistaSeleccionado = this.especialistaSeleccionado.filter(especialista => especialista !== valor);
      }
    } else if (tipo === 'paciente') {
      if (isChecked) {
        this.pacienteSeleccionado.push(valor);
      } else {
        this.pacienteSeleccionado = this.pacienteSeleccionado.filter(paciente => paciente !== valor);
      }
    }
  }
}