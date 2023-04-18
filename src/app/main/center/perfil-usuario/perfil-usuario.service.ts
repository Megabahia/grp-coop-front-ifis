import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {

  constructor(private _httpClient: HttpClient) { }

  obtenerInformacion(id) {
    return this._httpClient.get<any>(`${environment.apiUrl}/personas/personas/listOne/${id}`,);
  }
  guardarInformacion(datos) {
    return this._httpClient.post<any>(`${environment.apiUrl}/personas/personas/update/${datos.user_id}`, datos);
  }
  guardarImagen(datos,id){
    return this._httpClient.post<any>(`${environment.apiUrl}/personas/personas/update/imagen/${id}`, datos);
  }
}
