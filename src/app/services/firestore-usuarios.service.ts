import { Injectable } from '@angular/core';
import { Usuario } from '../classes/usuario';
import { Firestore, collection, collectionData, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';
import { Paciente } from '../classes/paciente';
import { Especialista } from '../classes/especialista';
import { Administrador } from '../classes/administrador';

@Injectable({
  providedIn: 'root'
})

export class FirestoreUsuariosService {
  private PATH = 'usuarios';

  constructor(private firestore: Firestore) {}

  // Función para guardar un nuevo usuario en la BD
  async guardar(usuario: Usuario | Paciente | Especialista): Promise<void> {
    try {
      const col = collection(this.firestore, this.PATH);

      if (usuario instanceof Paciente) {
        const docRef = await addDoc(col, {
          correo: usuario.correo,
          perfil: usuario.perfil,
          dni: usuario.dni,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          edad: usuario.edad,
          imagenUno: usuario.imagenUno,
          imagenDos: usuario.imagenDos,
          obraSocial: usuario.obraSocial,
        });

        usuario.id = docRef.id; // Guardo el ID generado por Firestore en el objeto Usuario
      } else if (usuario instanceof Especialista) {
        const docRef = await addDoc(col, {
          correo: usuario.correo,
          perfil: usuario.perfil,
          dni: usuario.dni,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          edad: usuario.edad,
          especialidad: usuario.especialidad,
          imagenPerfil: usuario.imagenPerfil,
          estado: usuario.estado,
        });

        usuario.id = docRef.id; // Guardo el ID generado por Firestore en el objeto Usuario
      }

      console.log('Usuario guardado correctamente en la BD');

    } catch (error) {
      console.error('Error guardando usuario en Firestore:', error);
    }
  }

  // Función para obtener un usuario específico por correo
  async getUsuarioPorCorreo(correo: string): Promise<Usuario | Paciente | Especialista | Administrador | undefined> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, where('correo', '==', correo.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return this.convertirAUsuario(doc.data(), doc.id);
    }

    return undefined;
  }


  // Función para obtener todos los usuarios según su perfil
  async obtenerUsuariosPorPerfil(perfil: string): Promise<(Usuario | Paciente | Especialista | Administrador)[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, where('perfil', '==', perfil));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => this.convertirAUsuario(doc.data(), doc.id));
  }

  // Función para convertir datos de Firestore a objeto Usuario
  private convertirAUsuario(doc: any, id: string): Usuario {
    switch (doc.perfil) {
      case 'Paciente':
        return new Paciente(
          doc.correo,
          '', // La clave la omito
          doc.nombre,
          doc.apellido,
          doc.edad,
          doc.dni,
          doc.obraSocial,
          doc.imagenUno,
          doc.imagenDos,
          id
        );
      case 'Especialista':
        return new Especialista(
          doc.correo,
          '', // La clave la omito
          doc.nombre,
          doc.apellido,
          doc.edad,
          doc.dni,
          doc.especialidad,
          doc.imagenPerfil,
          doc.estado,
          id
        );
        case 'Administrador':
          return new Administrador(
            doc.correo,
            '', // La clave la omito
            doc.nombre,
            doc.apellido,
            doc.edad,
            doc.dni,
            doc.imagenPerfil,
            id
          );
      default:
        return new Usuario(
          doc.correo,
          '', // La clave la omito
          doc.perfil,
          doc.nombre,
          doc.apellido,
          doc.edad,
          doc.dni,
          id
        );
    }
  }

  // Función para actualizar los datos de un usuario
  async updateUsuario(usuario: any): Promise<void> {
    if (!usuario.id) {
      console.error('Error: El usuario no tiene un ID.');
      return;
    }

    try {
      const userDocRef = doc(this.firestore, `${this.PATH}/${usuario.id}`);
      await updateDoc(userDocRef, { estado: usuario.estado });
      console.log('Estado modificado correctamente en la BD');
    } catch (error) {
      console.error('Error actualizando usuario en Firestore:', error);
    }
  }
}