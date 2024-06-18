import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent{
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService, private loader: LoaderService) { }

  async ngOnInit(): Promise<void> {
    this.authService.user$.subscribe(async isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }
  irABienvenido() {
    this.router.navigate(['/bienvenido']);
  }
  irALogin() {
    this.router.navigate(['/login']);
  }
  irARegistro() {
    this.router.navigate(['/registro']);
  }
  irASobreMi() {
    this.router.navigate(['/sobre-mi']);
  }
  irAMiPerfil() {
    this.router.navigate(['/mi-perfil']);
  }

  cerrarSesion() {
    this.loader.show();
    this.authService.logout();

    setTimeout(() => {
      this.loader.hide();
      this.router.navigate(['/bienvenido']);
    }, 1000);
  }
}