import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../classes/usuario';

@Component({
  selector: 'app-mensaje-confirmacion',
  standalone: true,
  imports: [],
  templateUrl: './mensaje-confirmacion.component.html',
  styleUrl: './mensaje-confirmacion.component.css'
})
export class MensajeConfirmacionComponent {
  constructor(private router: Router) {}
  @Input() usuario: Usuario | undefined = undefined;

  reenviarCorreo() {
    
  }

  irAInicio() {
    this.router.navigate(['/bienvenido']);
  }

  irAGestionUsuarios() {
    this.router.navigate(['/gestion-usuarios']);
  }
}
