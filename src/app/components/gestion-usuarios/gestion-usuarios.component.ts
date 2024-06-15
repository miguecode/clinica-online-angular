import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../classes/usuario';
import { Paciente } from '../../classes/paciente';
import { Especialista } from '../../classes/especialista';
import { Administrador } from '../../classes/administrador';
import { FirestoreUsuariosService } from '../../services/firestore-usuarios.service';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';

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
}
