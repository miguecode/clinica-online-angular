import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { Especialidad } from '../classes/especialidad';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadesService {
  private PATH = 'especialidades';

  constructor(private firestore: Firestore) {}

  async getEspecialidades(): Promise<Especialidad[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, orderBy('nombre', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return new Especialidad(data['nombre'], data['foto']);
    });
  }

  async getEspecialidadesNombres(): Promise<string[]> {
    const especialidades = await this.getEspecialidades();
    return especialidades.map((especialidad) => especialidad.nombre);
  }

  async agregarEspecialidad(nombre: string): Promise<void> {
    const col = collection(this.firestore, this.PATH);

    let foto =
      'https://firebasestorage.googleapis.com/v0/b/clinica-online-f6245.appspot.com/o/especialidades%2Fpredeterminada.png?alt=media&token=fa5e258d-e847-4aeb-92be-5d6e4c966910';

    await addDoc(col, { nombre, foto });
  }
}
