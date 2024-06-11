import { Usuario } from './usuario';

export class Administrador extends Usuario {
  imagenPerfil: string;

  constructor(correo: string, clave: string, nombre: string, apellido: string, edad: number, 
    dni: number, imagenPerfil: string, id?: string) {
    super(correo, clave, 'Administrador', nombre, apellido, edad, dni, id);
    this.imagenPerfil = imagenPerfil;
  }
}