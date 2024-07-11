import { Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Timestamp, DocumentData } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private PATH = 'logs';
  private logsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  logs$: Observable<string[]> = this.logsSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.initLogsListener();
  }

  async crear(nombreUsuario: string | undefined) {
    try {
      const col = collection(this.firestore, this.PATH);
      const fecha = Timestamp.now();
      await addDoc(col, { nombreUsuario, fecha });
    } catch (error) {
      console.error('Error al crear el log:', error);
    }
  }

  private initLogsListener(): void {
    const col = collection(this.firestore, this.PATH);
    const q = query(col, orderBy('fecha', 'asc'));

    onSnapshot(q, snapshot => {
      const logs: string[] = snapshot.docs.map(doc => this.convertirALog(doc.data()));
      this.logsSubject.next(logs);
    });
  }

  private convertirALog(doc: DocumentData): string {
    const fecha = (doc['fecha'] as Timestamp).toDate().toLocaleString();
    const nombreUsuario = doc['nombreUsuario'];
    return `[${fecha}] - ${nombreUsuario} ingresó al sistema.`;
  }
}
