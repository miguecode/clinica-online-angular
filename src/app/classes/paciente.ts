import { Usuario } from './usuario';

export class Paciente extends Usuario {
  obraSocial: string;
  imagenUno: string;
  imagenDos: string;
  historiaClinica?: any;

  constructor(
    correo: string,
    clave: string,
    nombre: string,
    apellido: string,
    edad: number,
    dni: number,
    obraSocial: string,
    imagenUno: string,
    imagenDos: string,
    historiaClinica?: any,
    id?: string
  ) {
    super(correo, clave, 'Paciente', nombre, apellido, edad, dni, id);
    this.obraSocial = obraSocial;
    this.imagenUno = imagenUno;
    this.imagenDos = imagenDos;
    this.historiaClinica = historiaClinica;
  }
}
