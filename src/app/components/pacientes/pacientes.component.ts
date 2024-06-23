import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { Paciente } from '../../classes/paciente';
import { FirestoreUsuariosService } from '../../services/firestore-usuarios.service';
import { LoaderService } from '../../services/loader.service';
import Swal from 'sweetalert2';
import { Administrador } from '../../classes/administrador';
import { Especialista } from '../../classes/especialista';
import { TurnosService } from '../../services/turnos.service';
import { Turno } from '../../classes/turno';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css',
})
export class PacientesComponent implements OnInit {
  usuarioActual: Usuario | undefined;
  listaTurnos: Turno[] = []; 
  listaPacientes: (Usuario | Paciente | Especialista | Administrador)[] = [];

  constructor (
    private turnosService: TurnosService, 
    private usuariosService: FirestoreUsuariosService,
    private loader: LoaderService, 
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loader.show();
    this.initData().finally(() => this.loader.hide());
  }

  async initData() {
    await this.cargarUsuarioActual();
    await Promise.all([this.cargarTurnos(), this.cargarPacientes()]);
    this.filtrarPacientesValidos();
  }

  async cargarUsuarioActual() {
    try {
      const correo = this.auth.getCurrentUserEmail();
      if (correo) {
        this.usuarioActual = await this.usuariosService.getUsuarioPorCorreo(correo);
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
    }
  }

  async cargarTurnos(): Promise<void> {
    try {
      this.listaTurnos = await this.turnosService.getTurnos();
    } catch (error) {
      console.error('Error obteniendo turnos:', error);
    }
  }

  async cargarPacientes(): Promise<void> {
    try {
      this.listaPacientes = await this.usuariosService.obtenerUsuariosPorPerfil('Paciente', 99);
    } catch (error) {
      console.error('Error obteniendo pacientes:', error);
    }
  }

  filtrarPacientesValidos() {
    if (!this.usuarioActual || !this.usuarioActual.id) return;

    const idPacientesPropios = this.listaTurnos
      .filter(t => t.idEspecialista === this.usuarioActual!.id)
      .map(t => t.idPaciente);

    this.listaPacientes = this.listaPacientes.filter(p => idPacientesPropios.includes(p.id!));
  }

  esPaciente(usuario: Usuario | Paciente | Especialista | Administrador): usuario is Paciente {
    return usuario instanceof Paciente;
  }

  mostrarHistoriaClinica(paciente: Paciente) {
    if (!paciente || paciente.historiaClinica === 'NN') {
      Swal.fire({
        title: 'Historia Clínica',
        text: 'La historia clínica está vacía o no se cargó aún.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3c5ebc',
        icon: 'info',
      });
      return;
    }

    const historiaClinica = paciente.historiaClinica;
    const fijos = `
      Temperatura: ${historiaClinica.temperatura || 'N/A'} °C <br>
      Peso: ${historiaClinica.peso || 'N/A'} kg <br>
      Presión: ${historiaClinica.presion || 'N/A'} mmHg <br>
      Altura: ${historiaClinica.altura || 'N/A'} cm <br>`;

    const opcionales = Object.keys(historiaClinica)
      .filter(key => !['temperatura', 'peso', 'presion', 'altura'].includes(key))
      .map(key => `${key}: ${historiaClinica[key]}`)
      .join('<br>');

    Swal.fire({
      title: 'Historia Clínica',
      html: `${fijos}${opcionales}`,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#3c5ebc',
    });
  }
}
