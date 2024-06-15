import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { FirestoreUsuariosService } from '../../services/firestore-usuarios.service';
import { Usuario } from '../../classes/usuario';
import { Administrador } from '../../classes/administrador';
import { Paciente } from '../../classes/paciente';
import { Especialista } from '../../classes/especialista';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  fechaYHora: string = '';
  usuarioActual: Usuario | Administrador | Paciente | Especialista | null | undefined = null;

  constructor(private router: Router, private loader: LoaderService,
              private auth: AuthService, private usuarios: FirestoreUsuariosService) {}

  ngOnInit(): void {
    this.getUsuarioActual();
    this.fechaYHora = this.getFechaFormateada();
  }

  async getUsuarioActual() {
    this.loader.show();
    try {
      const correo = this.auth.getCurrentUserEmail();
      if (correo) {
        this.usuarioActual = await this.usuarios.getUsuarioPorCorreo(correo);
      }
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
    } finally {
      this.loader.hide();
    }
  }

  getFechaFormateada(): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const fecha = new Date();
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${diaSemana}, ${dia} de ${mes} del ${año}`;
  }

  irAGestionDeUsuarios() {
    this.router.navigate(['/gestion-usuarios']);
  }

  irAMisTurnos() {
    this.router.navigate(['/mis-turnos']);
  }
}
