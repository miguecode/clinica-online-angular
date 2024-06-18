import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FirestoreUsuariosService } from '../../../services/firestore-usuarios.service';
import { Usuario } from '../../../classes/usuario';
import { Paciente } from '../../../classes/paciente';
import { Especialista } from '../../../classes/especialista';
import { Administrador } from '../../../classes/administrador';
import { EspecialidadesService } from '../../../services/especialidades.service';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../services/loader.service';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { Turno } from '../../../classes/turno';
import { TurnosService } from '../../../services/turnos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alta-turno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FechaPipe],
  templateUrl: './alta-turno.component.html',
  styleUrls: ['./alta-turno.component.css'],
  providers: [FechaPipe],
})
export class AltaTurnoComponent implements OnInit {
  usuarioActual: Usuario | Paciente | Administrador | undefined = undefined;
  formulario: FormGroup;
  especialidades: string[] = [];
  pacientes: Paciente[] = [];
  especialistas: Especialista[] = [];
  especialistasFiltrados: Especialista[] = [];
  fechas: { dia: string, hora: string }[] = [];
  fechaSeleccionada: { dia: string, hora: string } | undefined = undefined;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private usuarioService: FirestoreUsuariosService,
    private loader: LoaderService,
    private especialidadesService: EspecialidadesService,
    private turnosService: TurnosService,
    private pipeFechaTS: FechaPipe,
  ) {
    this.formulario = this.fb.group({
      especialidad: [null, [Validators.required]],
      especialista: [null, [Validators.required]],
      paciente: [null, [Validators.required]],
      fecha: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loader.show();
    const promesas: Promise<any>[] = [];

    this.cargarUsuarioActual().then(() => {
      promesas.push(this.cargarEspecialidades());
      promesas.push(this.cargarEspecialistas());

      if (this.usuarioActual?.perfil === 'Administrador') {
        promesas.push(this.cargarPacientes());
      }

      return Promise.all(promesas);
    })
    .catch(error => {
      console.error('Error en la inicialización:', error);
    })
    .finally(() => {
      this.loader.hide();
    });
  }

  async cargarUsuarioActual() {
    try {
      const correo = this.auth.getCurrentUserEmail();
      if (correo) {
        this.usuarioActual = await this.usuarioService.getUsuarioPorCorreo(correo);
        if (this.usuarioActual instanceof Paciente) {
          this.formulario.get('paciente')?.setValue(this.usuarioActual);
        }
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
    }
  }

  async cargarEspecialistas() {
    try {
      const usuarios = await this.usuarioService.obtenerUsuariosPorPerfil('Especialista', 99);
      this.especialistas = usuarios.filter(user => user instanceof Especialista) as Especialista[];
    } catch (error) {
      console.error('Error obteniendo especialistas:', error);
    }
  }

  async cargarPacientes() {
    try {
      const usuarios = await this.usuarioService.obtenerUsuariosPorPerfil('Paciente', 99);
      this.pacientes = usuarios.filter(user => user instanceof Paciente) as Paciente[];
    } catch (error) {
      console.error('Error obteniendo pacientes:', error);
    }
  }

  async cargarEspecialidades() {
    try {
      this.especialidades = await this.especialidadesService.getEspecialidades();
    } catch (error) {
      console.error('Error obteniendo especialidades:', error);
    }
  }

  onEspecialidadChange() {
    const especialidadSeleccionada = this.formulario.get('especialidad')?.value;
    this.especialistasFiltrados = this.especialistas.filter(especialista =>
      especialista.especialidad.includes(especialidadSeleccionada)
    );
    
    // Si cambio la especialidad, reseteo la selección del especialista
    this.formulario.get('especialista')?.reset();

    // Si el especialista es uno sólo, lo selecciono automáticamente
    if (this.especialistasFiltrados.length === 1) {
      this.formulario.get('especialista')?.setValue(this.especialistasFiltrados[0]);
      this.fechas = this.descomponerDisponibilidad(this.especialistasFiltrados[0].disponibilidad);

      // Si la fecha es una sola, la selecciono automáticamente
      if (this.fechas.length === 1) {
        this.formulario.get('fecha')?.setValue(this.fechas[0]);
        this.fechaSeleccionada = this.fechas[0];
      }

    } else {
      this.fechas = [];
      this.fechaSeleccionada = undefined;
    }
  }

  onEspecialistaChange() {
    const especialistaSeleccionado: Especialista = this.formulario.get('especialista')?.value;
    if (especialistaSeleccionado) {
      this.fechas = this.descomponerDisponibilidad(especialistaSeleccionado.disponibilidad);

      // Si la fecha es una sola, la selecciono automáticamente
      if (this.fechas.length === 1) {
        this.formulario.get('fecha')?.setValue(this.fechas[0]);
        this.fechaSeleccionada = this.fechas[0];
      } else {
        this.formulario.get('fecha')?.setValue(null);
        this.fechaSeleccionada = undefined;
      }

      console.log(this.fechas);
    }
  }

  descomponerDisponibilidad(disponibilidad: { [key: string]: string[] }): { dia: string, hora: string }[] {
    const fechas: { dia: string, hora: string }[] = [];
    Object.keys(disponibilidad).forEach(dia => {
      disponibilidad[dia].forEach(hora => {
        fechas.push({ dia, hora });
      });
    });
    return fechas;
  }

  seleccionarFecha(fecha: { dia: string, hora: string }) {
    this.fechaSeleccionada = fecha;
    this.formulario.get('fecha')?.setValue(`${fecha.dia} ${fecha.hora}`);
  }

  fechaEstaSeleccionada(fecha: { dia: string, hora: string }): boolean {
    return this.fechaSeleccionada?.dia === fecha.dia && this.fechaSeleccionada?.hora === fecha.hora;
  }

  async confirmar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.loader.show();

    const datos = this.formulario.value;
    console.log('Datos del formulario:', datos);

    let idPaciente: string = '';
    let apellidoPaciente: string = '';

    if (this.usuarioActual?.perfil === 'Paciente') {
      idPaciente = this.usuarioActual.id!;
      apellidoPaciente = this.usuarioActual.apellido;
    } else {
      idPaciente = datos.paciente.id;
      apellidoPaciente = datos.paciente.apellido;
    }

    const turnoNuevo = new Turno(
      idPaciente,
      datos.especialista.id,
      datos.especialidad,
      datos.especialista.apellido,
      apellidoPaciente,
      'NN',
      'NN',
      [],
      'Pendiente',
      datos.fecha,
    )

    console.log(turnoNuevo);

    if (turnoNuevo) {
      await this.turnosService.agregarTurno(turnoNuevo);
    }
    
    let fechaTransformada = this.pipeFechaTS.transform(datos.fecha);

    Swal.fire({
      title: "Turno generado correctamente",
      text: `El especialista ${datos.especialista.apellido} ahora tiene un turno 
      de ${datos.especialidad} pendiente con el paciente ${apellidoPaciente}, el ${fechaTransformada}`,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#3c5ebc',
      icon: "success"
    });

    this.limpiarCampos();
    this.loader.hide();
  }

  limpiarCampos() {
    this.formulario.reset();
    this.formulario.get('especialidad')?.reset();
    this.formulario.get('especialista')?.reset();
    this.formulario.get('paciente')?.reset();
    this.formulario.get('fecha')?.reset();
    this.fechaSeleccionada = undefined;
  }
}
