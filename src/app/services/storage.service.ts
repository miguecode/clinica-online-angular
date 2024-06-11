import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // Función para guardar la foto en Storage según su URL
  async subirImagenUrl(fileUri: string): Promise<string> {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, 'fotos/' + new Date().getTime() + '.jpg');

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  // Función para guardar la foto en Storage recibiendo el archivo
  async subirImagenFile(file: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, 'fotos/' + new Date().getTime() + '.jpg');
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error subiendo el archivo a Storage:', error);
      throw new Error('Error subiendo el archivo a Storage');
    }
  }
}