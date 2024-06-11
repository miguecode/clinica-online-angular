import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { DatosGithubComponent } from '../datos-github/datos-github.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenido',
  standalone: true,
  imports: [LoginComponent, DatosGithubComponent],
  templateUrl: './bienvenido.component.html',
  styleUrl: './bienvenido.component.css'
})
export class BienvenidoComponent implements OnInit{
  mostrarDatosGithub: boolean = false;

  constructor(private router: Router) {}

  irALogin() {
    this.router.navigate(['/login']);
  }
  irARegistro() {
    this.router.navigate(['/registro']);
  }
  irADatosGithub() {
    this.mostrarDatosGithub = true;
  }
  ngOnInit(): void {
    this.mostrarDatosGithub = false;
  }
}
