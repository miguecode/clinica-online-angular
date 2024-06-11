import { Usuario } from './usuario';

export class Paciente extends Usuario {
  obraSocial: string;
  imagenUno: string;
  imagenDos: string;

  constructor(correo: string, clave: string, nombre: string, apellido: string, edad: number, 
    dni: number, obraSocial: string, imagenUno: string, imagenDos: string, id?: string) {
    super(correo, clave, 'Paciente', nombre, apellido, edad, dni, id);
    this.obraSocial = obraSocial;
    this.imagenUno = imagenUno;
    this.imagenDos = imagenDos;
  }
}