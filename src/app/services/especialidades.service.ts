import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, getDocs, orderBy, query } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  private PATH = 'especialidades';

  constructor(private firestore: Firestore) { }

  async getEspecialidades(): Promise<string[]> {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, orderBy('nombre', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data()['nombre'] as string);
  }

  async agregarEspecialidad(nombre: string): Promise<void> {
    const col = collection(this.firestore, this.PATH);
    await addDoc(col, { nombre });
  }
}