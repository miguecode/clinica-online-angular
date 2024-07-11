import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { Especialidad } from '../../../classes/especialidad';
import Swal from 'sweetalert2';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Router } from '@angular/router';

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
  especialidades: Especialidad[] = [];
  pacientes: Paciente[] = [];
  especialistas: Especialista[] = [];
  especialistasFiltrados: Especialista[] = [];
  fechas: { dia: string; hora: string }[] = [];
  dias: string[] = [];
  horasFiltradas: string[] = [];
  diaSeleccionado: string | undefined = undefined;
  horaSeleccionada: string | undefined = undefined;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private usuarioService: FirestoreUsuariosService,
    private loader: LoaderService,
    private especialidadesService: EspecialidadesService,
    private turnosService: TurnosService,
    private pipeFechaTS: FechaPipe,
    private router: Router,
  ) {
    this.formulario = this.fb.group({
      especialidad: [null, [Validators.required]],
      especialista: [null, [Validators.required]],
      paciente: [null, [Validators.required]],
      fecha: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loader.show();
    const promesas: Promise<any>[] = [];

    this.cargarUsuarioActual()
      .then(() => {
        promesas.push(this.cargarEspecialidades());
        promesas.push(this.cargarEspecialistas());

        if (this.usuarioActual?.perfil === 'Administrador') {
          promesas.push(this.cargarPacientes());
        }

        return Promise.all(promesas);
      })
      .catch((error) => {
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
        this.usuarioActual = await this.usuarioService.getUsuarioPorCorreo(
          correo
        );
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
      const usuarios = await this.usuarioService.obtenerUsuariosPorPerfil(
        'Especialista',
        99
      );
      this.especialistas = usuarios.filter(
        (user) => user instanceof Especialista
      ) as Especialista[];
    } catch (error) {
      console.error('Error obteniendo especialistas:', error);
    }
  }

  async cargarPacientes() {
    try {
      const usuarios = await this.usuarioService.obtenerUsuariosPorPerfil(
        'Paciente',
        99
      );
      this.pacientes = usuarios.filter(
        (user) => user instanceof Paciente
      ) as Paciente[];
    } catch (error) {
      console.error('Error obteniendo pacientes:', error);
    }
  }

  async cargarEspecialidades() {
    try {
      this.especialidades =
        await this.especialidadesService.getEspecialidades();
    } catch (error) {
      console.error('Error obteniendo especialidades:', error);
    }
  }

  onEspecialidadChange() {
    const especialidadSeleccionada: Especialidad =
      this.formulario.get('especialidad')?.value;
    this.especialistasFiltrados = this.especialistas.filter((especialista) =>
      especialista.especialidad.includes(especialidadSeleccionada.nombre)
    );

    // Si cambio la especialidad, reseteo la selección del especialista
    this.formulario.get('especialista')?.reset();

    // Si el especialista es uno sólo, lo selecciono automáticamente
    if (this.especialistasFiltrados.length === 1) {
      this.formulario
        .get('especialista')
        ?.setValue(this.especialistasFiltrados[0]);
      this.fechas = this.descomponerDisponibilidad(
        this.especialistasFiltrados[0].disponibilidad
      );

      // Obtener los días únicos de la disponibilidad
      this.dias = [...new Set(this.fechas.map((fecha) => fecha.dia))];

      // Si la fecha es una sola, la selecciono automáticamente
      if (this.fechas.length === 1) {
        this.formulario.get('fecha')?.setValue(this.fechas[0]);
        this.diaSeleccionado = this.fechas[0].dia;
        this.horaSeleccionada = this.fechas[0].hora;
      }
    } else {
      this.fechas = [];
      this.dias = [];
      this.horasFiltradas = [];
      this.diaSeleccionado = undefined;
      this.horaSeleccionada = undefined;
    }
  }

  onEspecialistaChange() {
    const especialistaSeleccionado: Especialista =
      this.formulario.get('especialista')?.value;

    if (especialistaSeleccionado) {
      this.fechas = this.descomponerDisponibilidad(
        especialistaSeleccionado.disponibilidad
      );

      // Obtener los días únicos de la disponibilidad
      this.dias = [...new Set(this.fechas.map((fecha) => fecha.dia))];

      this.diaSeleccionado = undefined;
      this.horaSeleccionada = undefined;
      this.horasFiltradas = [];
    } else {
      this.fechas = [];
      this.dias = [];
      this.horasFiltradas = [];
      this.diaSeleccionado = undefined;
      this.horaSeleccionada = undefined;
    }
  }

  seleccionarDia(dia: string) {
    this.diaSeleccionado = dia;
    this.horasFiltradas = this.fechas
      .filter((fecha) => fecha.dia === dia)
      .map((fecha) => fecha.hora);

    // Si hay una sola hora para el día, la selecciono automáticamente
    if (this.horasFiltradas.length === 1) {
      this.seleccionarHora(this.horasFiltradas[0]);
    } else {
      this.horaSeleccionada = undefined;
    }
  }

  seleccionarHora(hora: string) {
    this.horaSeleccionada = hora;

    this.formulario.get('fecha')?.setValue({
      dia: this.diaSeleccionado,
      hora: this.horaSeleccionada,
    });
  }

  descomponerDisponibilidad(disponibilidad: {
    [key: string]: string[];
  }): { dia: string; hora: string }[] {
    const fechas: { dia: string; hora: string }[] = [];
    for (const dia in disponibilidad) {
      if (disponibilidad.hasOwnProperty(dia)) {
        const fechaFormateada = this.obtenerFechaProxima(dia);
        disponibilidad[dia].forEach((hora) => {
          fechas.push({ dia: fechaFormateada, hora });
        });
      }
    }
    return fechas;
  }

  obtenerFechaProxima(dia: string): string {
    const diasDeLaSemana = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const hoy = new Date();
    const diaActual = hoy.getDay();
    const diaObjetivo = diasDeLaSemana.indexOf(dia);
    let diasParaSumar = diaObjetivo - diaActual;

    if (diasParaSumar <= 0) {
      diasParaSumar += 7;
    }

    const fechaObjetivo = addDays(hoy, diasParaSumar);
    return format(fechaObjetivo, "dd 'de' MMMM", { locale: es });
  }

  transformarFecha(fecha: { dia: string; hora: string }): string {
    return `${fecha.dia} ${fecha.hora}`;
  }

  confirmar() {
    if (this.formulario.valid) {
      const pacienteSeleccionado = this.formulario.get('paciente')?.value;
      const especialistaSeleccionado =
        this.formulario.get('especialista')?.value;
      const especialidadSeleccionada =
        this.formulario.get('especialidad')?.value;
      const fechaSeleccionada = this.formulario.get('fecha')?.value;
      const fechaTransformada = this.transformarFecha(fechaSeleccionada);

      const turno: Turno = new Turno(
        pacienteSeleccionado.id,
        especialistaSeleccionado.id,
        especialidadSeleccionada.nombre,
        especialistaSeleccionado.apellido,
        pacienteSeleccionado.apellido,
        'NN',
        'NN',
        [],
        'Pendiente',
        fechaSeleccionada,
        'NN'
      );

      console.log(turno);

      this.turnosService.agregarTurno(turno).then(() => {
        Swal.fire({
          title: 'Turno generado correctamente',
          text: `El especialista ${especialistaSeleccionado.apellido} ahora tiene un turno 
          de ${especialidadSeleccionada.nombre} pendiente con el paciente ${pacienteSeleccionado.apellido}, el ${fechaTransformada}`,
          confirmButtonText: 'Listo',
          confirmButtonColor: '#3c5ebc',
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed) {
            // const especialista: Especialista = this.formulario.get('especialista')?.value;
            // especialista.disponibilidad

            this.router.navigate(['/mis-turnos']);
          }
        })
      });
    }
  }
}
