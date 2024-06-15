import { Component, OnInit } from '@angular/core';
import { Turno } from '../../../classes/turno';
import { TurnosService } from '../../../services/turnos.service';
import { AuthService } from '../../../services/auth.service';
import { FirestoreUsuariosService } from '../../../services/firestore-usuarios.service';
import { LoaderService } from '../../../services/loader.service';
import { Usuario } from '../../../classes/usuario';
import { TablaTurnosComponent } from '../tabla-turnos/tabla-turnos.component';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [TablaTurnosComponent],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent implements OnInit{
  // turnos: Turno[] = [];
  usuarioActual: Usuario | undefined;

  constructor(
    private authService: AuthService, 
    private usuarioService: FirestoreUsuariosService,
    private loader: LoaderService,
    private turnosService: TurnosService,
  ) {}

  ngOnInit(): void {
    this.getUsuarioActual();
    // this.cargarTurnos();
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

  /*
  async cargarTurnos() {
    this.loader.show();
    try {
      this.turnos = await this.turnosService.getTurnos();
    } catch (error) {
      console.error('Error obteniendo turnos:', error);
    } finally {
      this.loader.hide();
      console.log(this.turnos);
    }
  }*/
}
