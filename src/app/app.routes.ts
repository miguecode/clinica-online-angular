import { Routes } from '@angular/router';
import { logeadoGuard } from './guards/logeado.guard';
import { noLoginGuard } from './guards/no-login.guard';
import { adminGuard } from './guards/admin.guard';
import { noLoginSiAdminGuard } from './guards/no-login-si-admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'bienvenido', pathMatch: 'full' },
  {
    path: 'bienvenido',
    loadComponent: () => import('./components/bienvenido/bienvenido.component').then(m => m.BienvenidoComponent),
    canActivate: [noLoginGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [noLoginGuard]
  },
  {
    path: 'registro',
    loadComponent: () => import('./components/registro/registro.component').then(m => m.RegistroComponent),
    canActivate: [noLoginSiAdminGuard]
  },
  {
    path: 'inicio',
    loadComponent: () => import('./components/inicio/inicio.component').then(m => m.InicioComponent),
    canActivate: [logeadoGuard]
  },
  {
    path: 'sobre-mi',
    loadComponent: () => import('./components/datos-github/datos-github.component').then(m => m.DatosGithubComponent),
  },
  {
    path: 'gestion-usuarios',
    loadComponent: () => import('./components/gestion-usuarios/gestion-usuarios.component').then(m => m.GestionUsuariosComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'mis-turnos',
    loadComponent: () => import('./components/turnos/mis-turnos/mis-turnos.component').then(m => m.MisTurnosComponent),
    canActivate: [logeadoGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./components/error/error.component').then(m => m.ErrorComponent),
  }
];
