export class Usuario {
  correo: string;
  clave: string;
  perfil: string;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  public id?: string  // Campo opcional para almacenar el ID de Firestore

  constructor(correo: string, clave: string, perfil: string, nombre: string, apellido: string,
    edad: number, dni: number, id?: string) {
    this.correo = correo;
    this.clave = clave;
    this.perfil = perfil;
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dni = dni;
    this.id = id;
  }
}