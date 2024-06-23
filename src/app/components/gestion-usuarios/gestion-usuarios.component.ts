import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { Paciente } from '../../classes/paciente';
import { Especialista } from '../../classes/especialista';
import { Administrador } from '../../classes/administrador';
import { FirestoreUsuariosService } from '../../services/firestore-usuarios.service';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent implements OnInit {
  listaUsuarios: (Usuario | Paciente | Especialista | Administrador)[] = [];
  perfiles: string[] = ['Paciente', 'Especialista', 'Administrador'];
  perfilSeleccionado: string = 'Paciente';

  constructor (private usuariosService: FirestoreUsuariosService, private loader: LoaderService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    this.loader.show();
    this.listaUsuarios = await this.usuariosService.obtenerUsuariosPorPerfil(this.perfilSeleccionado, 99);
    this.loader.hide();
  }

  cambiarPerfil(perfil: string): void {
    this.perfilSeleccionado = perfil;
    this.cargarUsuarios();
  }

  esPaciente(usuario: Usuario | Paciente | Especialista | Administrador): usuario is Paciente {
    return usuario instanceof Paciente;
  }

  esEspecialista(usuario: Usuario | Paciente | Especialista | Administrador): usuario is Especialista {
    return usuario instanceof Especialista;
  }

  esAdministrador(usuario: Usuario | Paciente | Especialista | Administrador): usuario is Administrador {
    return usuario instanceof Administrador;
  }

  cambiarEstadoEspecialista(especialista: Especialista) {
    if (especialista.estado === 'Habilitado') {
      especialista.estado = 'Inhabilitado';
    } else {
      especialista.estado = 'Habilitado';
    }

    this.usuariosService.updateUsuario(especialista);
  }

  irAAlta() {
    this.router.navigate(['/registro']);
  }

  mostrarHistoriaClinica(paciente: Paciente) {
    if (!this.esPaciente || !paciente || paciente.historiaClinica === 'NN') {
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
    Altura: ${historiaClinica.altura || 'N/A'} cm <br>
  `;

    const opcionales = Object.keys(historiaClinica)
      .filter(key => !['temperatura', 'peso', 'presion', 'altura'].includes(key))
      .map(key => `${key}: ${historiaClinica[key]}`)
      .join('<br>');

    Swal.fire({
      title: 'Historia Clínica',
      html: `${fijos}${opcionales}`,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#3c5ebc',
      // icon: 'success',
    });
  }
}
