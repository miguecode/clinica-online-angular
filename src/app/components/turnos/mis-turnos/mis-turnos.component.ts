import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../classes/turno';
import { TurnosService } from '../../../services/turnos.service';
import { AuthService } from '../../../services/auth.service';
import { FirestoreUsuariosService } from '../../../services/firestore-usuarios.service';
import { LoaderService } from '../../../services/loader.service';
import { Usuario } from '../../../classes/usuario';
import { TablaTurnosComponent } from '../tabla-turnos/tabla-turnos.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

const mostrarOcultar = trigger('mostrarOcultar', [
  state (
    'abierto',
    style({opacity: 1 })
  ),
  state (
    'cerrado',
    style({ opacity: 0 })
  ),
    transition('abierto => cerrado', [animate('1s')]),
    transition('cerrado => abierto', [animate('0.5s')]),
]);

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [TablaTurnosComponent],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css',
  animations: [mostrarOcultar],
})
export class MisTurnosComponent implements OnInit{
  // turnos: Turno[] = [];
  usuarioActual: Usuario | undefined;

  constructor(
    private authService: AuthService, 
    private usuarioService: FirestoreUsuariosService,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.getUsuarioActual();
  }

  async getUsuarioActual() {
    this.loader.show();
    try {
      const correo = this.authService.getCurrentUserEmail();
      if (correo) {
        this.usuarioActual = await this.usuarioService.getUsuarioPorCorreo(correo);
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
    } finally {
      this.loader.hide();
      console.log(this.usuarioActual);
    }
  }

}
