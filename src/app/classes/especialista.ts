import { Usuario } from './usuario';

export class Especialista extends Usuario {
  especialidad: string[];
  imagenPerfil: string;
  estado: string;
  disponibilidad: { [key: string]: string[] };

  constructor(
    correo: string, 
    clave: string, 
    nombre: string, 
    apellido: string, 
    edad: number,
    dni: number, 
    especialidad: string[], 
    imagenPerfil: string, 
    estado: string, 
    disponibilidad: { [key: string]: string[] }, 
    id?: string
  ) {
    super(correo, clave, 'Especialista', nombre, apellido, edad, dni, id);
    this.especialidad = especialidad;
    this.imagenPerfil = imagenPerfil;
    this.estado = estado;
    this.disponibilidad = disponibilidad;
  }
}
