import { Routes } from '@angular/router';
import { logeadoGuard } from './guards/logeado.guard';
import { noLoginGuard } from './guards/no-login.guard';
import { adminGuard } from './guards/admin.guard';
import { noLoginSiAdminGuard } from './guards/no-login-si-admin.guard';
import { noEspecialistaGuard } from './guards/no-especialista.guard';
import { especialistaGuard } from './guards/especialista.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'bienvenido', pathMatch: 'full' },
  {
    path: 'bienvenido',
    loadComponent: () => import('./components/bienvenido/bienvenido.component').then(m => m.BienvenidoComponent),
    canActivate: [noLoginGuard]
  },
  {
    path: 'sobre-mi',
    loadComponent: () => import('./components/datos-github/datos-github.component').then(m => m.DatosGithubComponent),
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
    path: 'mi-perfil',
    loadComponent: () => import('./components/mi-perfil/mi-perfil.component').then(m => m.MiPerfilComponent),
    canActivate: [logeadoGuard]
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
    path: 'alta-turno',
    loadComponent: () => import('./components/turnos/alta-turno/alta-turno.component').then(m => m.AltaTurnoComponent),
    canActivate: [logeadoGuard, noEspecialistaGuard]
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./components/pacientes/pacientes.component').then(m => m.PacientesComponent),
    canActivate: [logeadoGuard, especialistaGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./components/error/error.component').then(m => m.ErrorComponent),
  }
];
